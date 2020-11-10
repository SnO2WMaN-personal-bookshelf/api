import {HttpModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {LoggerModule} from '../logger/logger.module';
import booksConfig from './books.config';
import {AuthorConnectionResolver, BooksResolver} from './books.resolver';
import {BooksService} from './books.service';
import {Book, BookSchema} from './schema/book.schema';

@Module({
  imports: [
    ConfigModule.forFeature(booksConfig),
    MongooseModule.forFeature([{name: Book.name, schema: BookSchema}]),
    HttpModule,
    LoggerModule,
  ],
  providers: [BooksService, BooksResolver, AuthorConnectionResolver],
  exports: [BooksService],
})
export class BooksModule {}
