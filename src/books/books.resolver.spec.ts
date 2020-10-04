import {getModelToken, MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Model} from 'mongoose';
import {OpenBDService} from '../openbd/openbd.service';
import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';
import {Book, BookSchema} from './schema/book.schema';

describe('BooksResolver', () => {
  let mongoServer: MongoMemoryServer;

  let bookResolver: BooksResolver;
  let bookModel: Model<Book>;

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
      ],
      providers: [
        BooksService,
        BooksResolver,
        {
          provide: OpenBDService,
          useValue: {
            getCover: (isbn: string) => `https://cover.openbd.jp/${isbn}.jpg`,
          },
        },
      ],
    }).compile();

    bookModel = module.get<Model<Book>>(getModelToken(Book.name));
    bookResolver = module.get<BooksResolver>(BooksResolver);
  });

  afterEach(async () => {
    await bookModel.deleteMany({});
  });

  afterAll(async () => {
    await mongoServer.stop();
  });

  it('should be defined', () => {
    expect(bookResolver).toBeDefined();
  });

  describe('book()', () => {
    it('IDに結び付けられたbookを取得', async () => {
      const book = await bookModel.create({
        title: 'よふかしのうた(1)',
        isbn: '9784091294920',
      });

      const actual = await bookResolver.book(book.id);

      expect(actual).toHaveProperty('id');
      expect(actual).toHaveProperty('title');
      expect(actual).toHaveProperty('isbn');
    });
  });

  describe('cover()', () => {
    it('ISBNがある場合', async () => {
      const book = await bookModel.create({
        title: 'よふかしのうた(1)',
        isbn: '9784091294920',
      });
      const actual = await bookResolver.cover(book);
      expect(actual).toBe(`https://cover.openbd.jp/9784091294920.jpg`);
    });

    it('ISBNがない場合', async () => {
      const book = await bookModel.create({
        title: 'よふかしのうた(1)',
      });
      const actual = await bookResolver.cover(book);
      expect(actual).toBeNull();
    });
  });
});
