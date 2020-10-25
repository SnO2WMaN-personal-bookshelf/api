import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BooksModule} from '../books/books.module';
import {BookshelfRecordsModule} from '../bookshelf-records/bookshelf-records.module';
import {BookshelfRecord} from '../bookshelf-records/entity/bookshelf-record.entity';
import {BookshelvesResolver} from './bookshelves.resolver';
import {BookshelvesService} from './bookshelves.service';
import {Bookshelf} from './entity/bookshelf.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bookshelf, BookshelfRecord]),
    BooksModule,
    BookshelfRecordsModule,
  ],
  providers: [BookshelvesService, BookshelvesResolver],
})
export class BookshelvesModule {}
