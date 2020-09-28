import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {TypeOrmModuleOptions, TypeOrmOptionsFactory} from '@nestjs/typeorm';
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
      type: 'mysql',
      host: this.configService.host,
      port: this.configService.port,
      username: this.configService.username,
      password: this.configService.password,
      database: this.configService.database,
      entities: [User],
      synchronize: true,
    };
  }
}
