import {Test, TestingModule} from '@nestjs/testing';
import {BookshelvesResolver} from './bookshelves.resolver';
import {BookshelvesService} from './bookshelves.service';

describe('BookshelvesResolver', () => {
  let bookshelvesService: BookshelvesService;
  let bookshelvesResolver: BookshelvesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
    bookshelvesResolver = module.get<BookshelvesResolver>(BookshelvesResolver);
  });

  it('should be defined', () => {
    expect(bookshelvesResolver).toBeDefined();
  });
});
