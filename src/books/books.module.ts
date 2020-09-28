import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {BooksService} from './books.service';
import {Book, BookSchema} from './schema/book.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Book.name, schema: BookSchema}])],
  providers: [BooksService],
  exports: [BooksService],
})
export class BooksModule {}
