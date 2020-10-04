import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {OpenBDModule} from '../openbd/openbd.module';
import {BooksResolver} from './books.resolver';
import {BooksService} from './books.service';
import {Book, BookSchema} from './schema/book.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Book.name, schema: BookSchema}]),
    OpenBDModule,
  ],
  providers: [BooksService, BooksResolver],
  exports: [BooksService],
})
export class BooksModule {}
