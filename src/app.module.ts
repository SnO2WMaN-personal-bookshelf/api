import {Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {MongooseModule} from '@nestjs/mongoose';
import {TypeOrmModule} from '@nestjs/typeorm';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {BooksModule} from './books/books.module';
import {BooksService} from './books/books.service';
import mongooseConfig from './config/mongoose.config';
import {MongooseService} from './mongoose/mongoose.service';
import {OpenBDModule} from './openbd/openbd.module';
import typeormConfig from './typeorm/typeorm.config';
import {TypeORMConfigService} from './typeorm/typeorm.service';
import {UsersModule} from './users/users.module';

@Module({
  imports: [
    OpenBDModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(mongooseConfig)],
      useClass: MongooseService,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeormConfig)],
      useClass: TypeORMConfigService,
    }),
    BooksModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService, BooksService],
})
export class AppModule {}
