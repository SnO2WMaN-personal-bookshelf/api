import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {Author, AuthorSchema} from '../authors/entity/author.entity';
import {Book, BookSchema} from '../books/schema/book.schema';
import {Series, SeriesSchema} from '../series/entity/series.entity';
import {SearchResolver} from './search.resolver';
import {SearchService} from './search.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Book.name,
        schema: BookSchema,
      },
      {
        name: Series.name,
        schema: SeriesSchema,
      },
      {
        name: Author.name,
        schema: AuthorSchema,
      },
    ]),
  ],
  providers: [SearchService, SearchResolver],
})
export class SearchModule {}
