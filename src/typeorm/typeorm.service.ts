import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {BookshelfRecord} from '../bookshelf-records/entity/bookshelf-record.entity';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import {User} from '../users/entity/user.entity';
import typeormConfig from './typeorm.config';

@Injectable()
export class TypeORMConfigService implements TypeOrmOptionsFactory {
  constructor(
    @Inject(typeormConfig.KEY)
    private configService: ConfigType<typeof typeormConfig>,
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.configService.host,
      port: this.configService.port,
      username: this.configService.username,
      password: this.configService.password,
      database: this.configService.database,
      entities: [User, Bookshelf, BookshelfRecord],
      synchronize: true,
    };
  }
}
