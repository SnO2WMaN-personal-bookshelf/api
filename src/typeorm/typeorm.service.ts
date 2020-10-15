import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import typeormConfig from '../configs/typeorm.config';
import {User} from '../users/entity/user.entity';

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
      entities: [User, Bookshelf],
      synchronize: true,
    };
  }
}
