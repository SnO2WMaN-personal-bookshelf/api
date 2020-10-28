import {getModelToken, MongooseModule} from '@nestjs/mongoose';
import {Test, TestingModule} from '@nestjs/testing';
import {MongoMemoryServer} from 'mongodb-memory-server';
import {Model} from 'mongoose';
import {BooksService} from './books.service';
import {Book, BookSchema} from './schema/book.schema';

describe('BookService', () => {
  let mongoServer: MongoMemoryServer;

  let bookModel: Model<Book>;
  let bookService: BooksService;

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
      providers: [BooksService],
    }).compile();

    bookModel = module.get<Model<Book>>(getModelToken(Book.name));
    bookService = module.get<BooksService>(BooksService);
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
});
