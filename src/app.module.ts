import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {GraphQLModule} from '@nestjs/graphql';
import {MongooseModule} from '@nestjs/mongoose';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from './auth/auth.module';
import {Auth0Module} from './auth0/auth0.module';
import {AuthorsModule} from './authors/authors.module';
import {BooksModule} from './books/books.module';
import {BookshelfRecordsModule} from './bookshelf-records/bookshelf-records.module';
import {BookshelvesModule} from './bookshelves/bookshelves.module';
import {GraphQLAuthGuard} from './guards/graphql-auth.guard';
import mongooseConfig from './mongoose/mongoose.config';
import {MongooseService} from './mongoose/mongoose.service';
import {SearchModule} from './search/search.module';
import {SeriesModule} from './series/series.module';
import typeormConfig from './typeorm/typeorm.config';
import {TypeORMConfigService} from './typeorm/typeorm.service';
import {UsersModule} from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      context: ({req}) => ({req}),
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongooseConfig)],
      useClass: MongooseService,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeormConfig)],
      useClass: TypeORMConfigService,
    }),
    UsersModule,
    BooksModule,
    BookshelvesModule,
    BookshelfRecordsModule,
    AuthorsModule,
    SeriesModule,
    AuthModule,
    Auth0Module,
    SearchModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GraphQLAuthGuard,
    },
  ],
})
export class AppModule {}
