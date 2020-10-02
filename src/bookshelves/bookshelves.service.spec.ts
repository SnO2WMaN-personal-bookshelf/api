import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
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

  describe('getBookshelf()', () => {
    it('IDに結び付けられたBookshelfを取得', async () => {
      jest
        .spyOn(bookshelfRepogitory, 'findOne')
        .mockResolvedValueOnce({id: '1', bookIDs: []});

      const bookshelf = await bookshelfService.getBookshelf('1');
      expect(bookshelf).toHaveProperty('id');
      expect(bookshelf).toHaveProperty('bookIDs');
    });

    it('IDに結び付けられたBookshelfが存在しない場合はnullを返す', async () => {
      jest
        .spyOn(bookshelfRepogitory, 'findOne')
        .mockResolvedValueOnce(undefined);

      const bookshelf = await bookshelfService.getBookshelf('1');
      expect(bookshelf).toBeNull();
    });
  });
});
