import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {BookshelfRecord} from '../bookshelf-records/entity/bookshelf-record.entity';
import {Bookshelf} from './entity/bookshelf.entity';

@Injectable()
export class BookshelvesService {
  constructor(
    @InjectRepository(Bookshelf)
    private bookshelvesRepository: Repository<Bookshelf>,

    @InjectRepository(BookshelfRecord)
    private readonly bookshelfRecordsRepository: Repository<BookshelfRecord>,
  ) {}

  async getBookshelf(id: string) {
    return this.bookshelvesRepository.findOneOrFail(id, {
      relations: ['records'],
    });
  }

  async totalRecords(id: string) {
    return this.bookshelfRecordsRepository.count({
      where: {bookshelf: id},
    });
  }
}
