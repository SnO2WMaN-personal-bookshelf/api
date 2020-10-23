import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {APP_GUARD} from '@nestjs/core';
import {GraphQLModule} from '@nestjs/graphql';
import {MongooseModule} from '@nestjs/mongoose';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AuthModule} from './auth/auth.module';
import {Auth0Module} from './auth0/auth0.module';
import {BooksModule} from './books/books.module';
import {BookshelfRecordsModule} from './bookshelf-records/bookshelf-records.module';
import {BookshelvesModule} from './bookshelves/bookshelves.module';
import mongooseConfig from './configs/mongoose.config';
import typeormConfig from './configs/typeorm.config';
import {GraphQLAuthGuard} from './guards/graphql-auth.guard';
import {MongooseService} from './mongoose/mongoose.service';
import {OpenBDModule} from './openbd/openbd.module';
import {TypeORMConfigService} from './typeorm/typeorm.service';
import {UsersModule} from './users/users.module';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.graphql',
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
    OpenBDModule,
    UsersModule,
    BooksModule,
    BookshelvesModule,
    BookshelfRecordsModule,
    AuthModule,
    Auth0Module,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: GraphQLAuthGuard,
    },
  ],
})
export class AppModule {}
