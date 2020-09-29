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
    return this.bookshelvesRepository
      .findOne(id)
      .then((bookshelf) => bookshelf || null);
  }
}
