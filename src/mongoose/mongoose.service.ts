import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {MongooseModuleOptions, MongooseOptionsFactory} from '@nestjs/mongoose';
import {format as formatMongoURI} from 'mongodb-uri';
import mongooseConfig from '../config/mongoose.config';

@Injectable()
export class MongooseService implements MongooseOptionsFactory {
  constructor(
    @Inject(mongooseConfig.KEY)
    private config: ConfigType<typeof mongooseConfig>,
  ) {}

  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: formatMongoURI({
        scheme: 'mongodb',
        options: {authSource: 'admin'},
        hosts: this.config.hosts,
        database: this.config.database,
        username: this.config.username,
        password: this.config.password,
      }),
    };
  }
}
