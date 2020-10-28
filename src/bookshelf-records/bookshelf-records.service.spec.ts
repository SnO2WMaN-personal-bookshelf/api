import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BooksService} from '../books/books.service';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import {BookshelfRecordsService} from './bookshelf-records.service';
import {BookshelfRecord} from './entity/bookshelf-record.entity';

describe('BookshelfRecordsService', () => {
  let service: BookshelfRecordsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(BookshelfRecord),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Bookshelf),
          useClass: Repository,
        },
        {
          provide: BooksService,
          useValue: {
            exists(id: string) {
              return true;
            },
          },
        },
        BookshelfRecordsService,
      ],
    }).compile();

    service = module.get<BookshelfRecordsService>(BookshelfRecordsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
