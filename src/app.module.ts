import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {GraphQLModule} from '@nestjs/graphql';
import {MongooseModule} from '@nestjs/mongoose';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Auth0Module} from './auth0/auth0.module';
import {BooksModule} from './books/books.module';
import {BookshelvesModule} from './bookshelves/bookshelves.module';
import mongooseConfig from './mongoose/mongoose.config';
import {MongooseService} from './mongoose/mongoose.service';
import {OpenBDModule} from './openbd/openbd.module';
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
    OpenBDModule,
    UsersModule,
    BooksModule,
    BookshelvesModule,
    Auth0Module,
  ],
})
export class AppModule {}
