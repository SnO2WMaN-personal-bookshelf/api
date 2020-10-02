import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {BooksModule} from '../books/books.module';
import {BookshelvesResolver} from './bookshelves.resolver';
import {BookshelvesService} from './bookshelves.service';
import {Bookshelf} from './entity/bookshelf.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bookshelf]), BooksModule],
  providers: [BookshelvesService, BookshelvesResolver],
})
export class BookshelvesModule {}
