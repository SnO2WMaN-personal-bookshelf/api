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

  describe('addBooksToBookshelf', () => {
    it('IDに結び付けられたBookshelfにまだ登録されていないBookIDを複数追加', async () => {
      jest
        .spyOn(bookshelfRepogitory, 'findOne')
        .mockResolvedValueOnce({id: '1', bookIDs: []});

      const actual = await bookshelfService.addBooksToBookshelf('1', [
        '1',
        '2',
      ]);

      expect(actual).toBeDefined();
      expect(actual).toHaveProperty('id');
      expect(actual).toHaveProperty('bookIDs', ['1']);
    });

    it('IDに結び付けられたBookshelfにすでに登録されているBookIDを複数追加', async () => {
      jest
        .spyOn(bookshelfRepogitory, 'findOne')
        .mockResolvedValueOnce({id: '1', bookIDs: ['1', '2']});

      const actual = await bookshelfService.addBooksToBookshelf('1', [
        '1',
        '2',
        '3',
      ]);

      expect(actual).toBeDefined();
      expect(actual).toHaveProperty('id');
      expect(actual).toHaveProperty('bookIDs', ['1', '2', '3']);
    });

    it('IDに結び付けられたBookshelfが存在しない場合はnullを返す', async () => {
      jest
        .spyOn(bookshelfRepogitory, 'findOne')
        .mockResolvedValueOnce(undefined);

      const actual = await bookshelfService.addBooksToBookshelf('1', ['1']);

      expect(actual).toBeNull();
    });
  });
});
