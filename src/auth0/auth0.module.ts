import {HttpModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import auth0Config from './auth0.config';
import {Auth0Service} from './auth0.service';

@Module({
  imports: [ConfigModule.forFeature(auth0Config), HttpModule],
  providers: [Auth0Service],
  exports: [Auth0Service],
})
export class Auth0Module {}
