import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {BooksModule} from '../books/books.module';
import {AuthorsResolver} from './authors.resolver';
import {AuthorsService} from './authors.service';
import {Author, AuthorSchema} from './entity/author.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Author.name, schema: AuthorSchema}]),
    BooksModule,
  ],
  providers: [AuthorsResolver, AuthorsService],
  exports: [AuthorsService],
})
export class AuthorsModule {}
