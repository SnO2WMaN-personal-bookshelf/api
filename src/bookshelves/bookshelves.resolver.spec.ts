import {Test, TestingModule} from '@nestjs/testing';
import * as faker from 'faker';
import {encode} from 'js-base64';
import {BooksService} from '../books/books.service';
import {BookshelvesResolver} from './bookshelves.resolver';
import {BookshelvesService} from './bookshelves.service';
import {Bookshelf} from './entity/bookshelf.entity';

describe('BookshelvesResolver', () => {
  describe('正常にBookshelfを取得できる場合', () => {
    let bookshelvesService: BookshelvesService;
    let bookshelvesResolver: BookshelvesResolver;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: BooksService,
            useValue: {
              async getBook(id: string) {
                return {id};
              },
            },
          },
          {
            provide: BookshelvesService,
            useValue: {
              getBookshelf(id: string) {
                return {id, books: []};
              },
            },
          },
          BookshelvesResolver,
        ],
      }).compile();

      bookshelvesService = module.get<BookshelvesService>(BookshelvesService);
      bookshelvesResolver = module.get<BookshelvesResolver>(
        BookshelvesResolver,
      );
    });

    it('should be defined', () => {
      expect(bookshelvesResolver).toBeDefined();
    });

    describe('bookshelf()', () => {
      it('IDに結び付けられたBookshelfを返す', async () => {
        const bookshelf = await bookshelvesResolver.bookshelf('1');
        expect(bookshelf).not.toBeNull();
        expect(bookshelf).toHaveProperty('id');
      });
    });
  });

  describe('books()', () => {
    let bookshelvesResolver: BookshelvesResolver;

    beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          {
            provide: BooksService,
            useValue: {
              async getBook(id: string) {
                return {
                  id,
                  title: faker.name.title(),
                };
              },
            },
          },
          {provide: BookshelvesService, useValue: {}},
          BookshelvesResolver,
        ],
      }).compile();

      bookshelvesResolver = module.get<BookshelvesResolver>(
        BookshelvesResolver,
      );
    });

    it('should be defined', () => {
      expect(bookshelvesResolver).toBeDefined();
    });

    it('最初の50件を取得する', async () => {
      const bookshelf: Bookshelf = {
        id: '1',
        bookIDs: [...new Array(100)].map((_, i) => `${i}`),
      };
      const {
        nodes,
        totalItems,
        pageInfo,
        edges,
      } = await bookshelvesResolver.books(bookshelf, {
        after: encode('0'),
        first: 50,
      });

      expect(nodes).toBeDefined();
      expect(nodes).toHaveLength(50);

      expect(totalItems).toBe(100);

      expect(edges).toBeDefined();
      expect(edges).toHaveLength(50);

      expect(edges![0]).toBeDefined();
      expect(edges![0]).toHaveProperty('cursor', encode('0'));

      expect(edges![edges!.length - 1]).toBeDefined();
      expect(edges![edges!.length - 1]).toHaveProperty('cursor', encode('49'));

      expect(pageInfo).toHaveProperty('hasPreviousPage', false);
      expect(pageInfo).toHaveProperty('hasNextPage', true);
      expect(pageInfo).toHaveProperty('startCursor', encode('0'));
      expect(pageInfo).toHaveProperty('endCursor', encode('49'));
    });

    it('20件しかない場合に最初の50件を取得する', async () => {
      const bookshelf: Bookshelf = {
        id: '1',
        bookIDs: [...new Array(20)].map((_, i) => `${i}`),
      };
      const {
        nodes,
        totalItems,
        pageInfo,
        edges,
      } = await bookshelvesResolver.books(bookshelf, {
        after: encode('0'),
        first: 50,
      });

      expect(nodes).toBeDefined();
      expect(nodes).toHaveLength(20);

      expect(totalItems).toBe(20);

      expect(edges).toBeDefined();
      expect(edges).toHaveLength(20);

      expect(edges![0]).toBeDefined();
      expect(edges![0]).toHaveProperty('cursor', encode('0'));

      expect(edges![edges!.length - 1]).toBeDefined();
      expect(edges![edges!.length - 1]).toHaveProperty('cursor', encode('19'));

      expect(pageInfo).toHaveProperty('hasPreviousPage', false);
      expect(pageInfo).toHaveProperty('hasNextPage', false);
      expect(pageInfo).toHaveProperty('startCursor', encode('0'));
      expect(pageInfo).toHaveProperty('endCursor', encode('19'));
    });

    it('afterカーソルを指定してその次の50件を取得する', async () => {
      const bookshelf: Bookshelf = {
        id: '1',
        bookIDs: [...new Array(100)].map((_, i) => `${i}`),
      };
      const {
        nodes,
        totalItems,
        pageInfo,
        edges,
      } = await bookshelvesResolver.books(bookshelf, {
        after: encode('20'),
        first: 50,
      });

      expect(nodes).toBeDefined();
      expect(nodes).toHaveLength(50);

      expect(totalItems).toBe(100);

      expect(edges).toBeDefined();
      expect(edges).toHaveLength(50);

      expect(edges![0]).toBeDefined();
      expect(edges![0]).toHaveProperty('cursor', encode('20'));

      expect(edges![edges!.length - 1]).toBeDefined();
      expect(edges![edges!.length - 1]).toHaveProperty('cursor', encode('69'));

      expect(pageInfo).toHaveProperty('hasPreviousPage', true);
      expect(pageInfo).toHaveProperty('hasNextPage', true);
      expect(pageInfo).toHaveProperty('startCursor', encode('20'));
      expect(pageInfo).toHaveProperty('endCursor', encode('69'));
    });
  });
});
