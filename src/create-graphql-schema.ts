import {NestFactory} from '@nestjs/core';
import {
  GraphQLSchemaBuilderModule,
  GraphQLSchemaFactory,
} from '@nestjs/graphql';
import {writeFile} from 'fs';
import {printSchema} from 'graphql';
import * as path from 'path';
import {promisify} from 'util';
import {AuthorsResolver} from './authors/authors.resolver';
import {BooksResolver} from './books/books.resolver';
import {BookshelfRecordsResolver} from './bookshelf-records/bookshelf-records.resolver';
import {BookshelvesResolver} from './bookshelves/bookshelves.resolver';
import {SearchResolver} from './search/search.resolver';
import {SeriesRecordResolver, SeriesResolver} from './series/series.resolver';
import {UsersResolver} from './users/users.resolver';

(async () => {
  const app = await NestFactory.create(GraphQLSchemaBuilderModule);
  await app.init();

  await app
    .get(GraphQLSchemaFactory)
    .create([
      UsersResolver,
      BookshelvesResolver,
      BookshelfRecordsResolver,
      BooksResolver,
      AuthorsResolver,
      SeriesResolver,
      SeriesRecordResolver,
      SearchResolver,
    ])
    .then((schema) => printSchema(schema))
    .then((data) =>
      promisify(writeFile)(path.resolve(process.cwd(), 'schema.graphql'), data),
    );

  await app.close();
})();
