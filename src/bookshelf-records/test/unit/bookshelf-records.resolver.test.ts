import {Test, TestingModule} from '@nestjs/testing';
import {BooksService} from '../../../books/books.service';
import {BookshelfRecordsResolver} from '../../bookshelf-records.resolver';

describe('BookshelfRecordsResolver', () => {
  let module: TestingModule;

  let resolver: BookshelfRecordsResolver;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {
          provide: BookshelfRecordsResolver,
          useValue: {},
        },
        {
          provide: BooksService,
          useValue: {
            getBook(id: string) {
              return {id};
            },
          },
        },
      ],
    }).compile();

    resolver = module.get<BookshelfRecordsResolver>(BookshelfRecordsResolver);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
