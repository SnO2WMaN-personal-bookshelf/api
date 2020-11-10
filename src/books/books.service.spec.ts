import {HttpModule, HttpService} from '@nestjs/common';
import {getModelToken, MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Model} from 'mongoose';
import {of} from 'rxjs';
import booksConfig from './books.config';
import {BooksService} from './books.service';
import {Book, BookSchema} from './schema/book.schema';

describe('BookService', () => {
  let mongoServer: MongoMemoryServer;

  let bookModel: Model<Book>;

  let bookService: BooksService;
  let httpService: HttpService;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRootAsync({
          useFactory: async () => ({uri: await mongoServer.getUri()}),
        }),
        MongooseModule.forFeature([{name: Book.name, schema: BookSchema}]),
        HttpModule,
      ],
      providers: [
        {
          provide: booksConfig.KEY,
          useValue: {
            bookcoverServerUrl: 'example.dev',
          },
        },
        BooksService,
      ],
    }).compile();

    bookModel = module.get<Model<Book>>(getModelToken(Book.name));

    bookService = module.get<BooksService>(BooksService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(async () => {
    await bookModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(bookService).toBeDefined();
  });

  describe('bookcover', () => {
    it('書影サーバから404が返ってくる場合', async () => {
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: undefined,
          status: 404,
          statusText: 'Not found book',
          headers: {},
          config: {},
        }),
      );

      const book = await bookModel.create({
        _id: '1',
        title: 'title',
        authors: [],
      });

      const actual = await bookService.bookcover(book);
      expect(actual).toBeNull();
    });

    it('書影サーバと接続不能', async () => {
      jest.spyOn(httpService, 'get').mockReturnValueOnce(
        of({
          data: undefined,
          status: 500,
          statusText: 'connect ECONNREFUSED',
          headers: {},
          config: {},
        }),
      );

      const book = await bookModel.create({
        _id: '1',
        title: 'title',
        authors: [],
      });

      const actual = await bookService.bookcover(book);
      expect(actual).toBeNull();
    });
  });
});
