import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BooksModule} from '../books/books.module';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import {BookshelfRecordsResolver} from './bookshelf-records.resolver';
import {BookshelfRecordsService} from './bookshelf-records.service';
import {BookshelfRecord} from './entity/bookshelf-record.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([BookshelfRecord, Bookshelf]),
    BooksModule,
  ],
  providers: [BookshelfRecordsResolver, BookshelfRecordsService],
})
export class BookshelfRecordsModule {}
