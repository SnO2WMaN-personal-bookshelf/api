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

  describe('getBook()', () => {
    it('IDに結び付けられた本を取得', async () => {
      const book = await bookModel.create({
        title: 'よふかしのうた(1)',
        isbn: '9784091294920',
      });

      const actual = await bookService.getBook(book.id);

      expect(actual).toHaveProperty('id');
      expect(actual).toHaveProperty('title');
      expect(actual).toHaveProperty('isbn');
    });

    it('IDに結び付けられた本が存在しない場合はnullを返す', async () => {
      await bookModel.create({
        _id: '5f71e2c09639ed18ce662dab',
        title: 'よふかしのうた(1)',
        isbn: '9784091294920',
      });

      const actual = await bookService.getBook('6f71e2c09639ed18ce662dab');

      expect(actual).toBeNull();
    });

    it('無効なID', async () => {
      await expect(bookService.getBook('0')).rejects.toThrow(
        'Cast to ObjectId failed',
      );
    });
  });
});
