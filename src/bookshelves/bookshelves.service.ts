import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Bookshelf} from './entity/bookshelf.entity';

@Injectable()
export class BookshelvesService {
  constructor(
    @InjectRepository(Bookshelf)
    private bookshelvesRepository: Repository<Bookshelf>,
  ) {}

  async getBookshelf(id: string): Promise<Bookshelf | null> {
    return this.bookshelvesRepository.findOneOrFail(id, {
      relations: ['records'],
    });
  }

  async addBooksToBookshelf(
    bookshelfId: string,
    books: string[],
  ): Promise<Bookshelf | null> {
    const bookshelf = await this.getBookshelf(bookshelfId);
    if (bookshelf) {
      bookshelf.bookIDs.push(...books);
      bookshelf.bookIDs = [...new Set(bookshelf.bookIDs)];
      return this.bookshelvesRepository.save(bookshelf);
    }
    return null;
  }

  async addBookToBookshelf(bookshelfId: string, bookId: string) {
    return this.addBooksToBookshelf(bookshelfId, [bookId]);
  }
}
