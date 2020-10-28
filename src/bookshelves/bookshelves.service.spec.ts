import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BookshelfRecord} from '../bookshelf-records/entity/bookshelf-record.entity';
import {BookshelvesService} from './bookshelves.service';
import {Bookshelf} from './entity/bookshelf.entity';

describe('BookshelvesService', () => {
  let bookshelfService: BookshelvesService;
  let bookshelfRepogitory: Repository<Bookshelf>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(Bookshelf),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(BookshelfRecord),
          useClass: Repository,
        },
        BookshelvesService,
      ],
    }).compile();

    bookshelfRepogitory = module.get<Repository<Bookshelf>>(
      getRepositoryToken(Bookshelf),
    );
    bookshelfService = module.get<BookshelvesService>(BookshelvesService);
  });

  it('should be defined', () => {
    expect(bookshelfService).toBeDefined();
  });
});
