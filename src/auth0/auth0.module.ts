import {HttpModule, Module} from '@nestjs/common';
import {ConfigModule} from '@nestjs/config';
import {PassportModule} from '@nestjs/passport';
import auth0Config from './auth0.config';
import {Auth0Service} from './auth0.service';
import {JwtStrategy} from './jwt.strategy';

@Module({
  imports: [
    ConfigModule.forFeature(auth0Config),
    HttpModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
  ],
  providers: [Auth0Service, JwtStrategy],
  exports: [Auth0Service, PassportModule],
})
export class Auth0Module {}
