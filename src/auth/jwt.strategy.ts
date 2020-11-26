import {Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {PassportStrategy} from '@nestjs/passport';
import {passportJwtSecret} from 'jwks-rsa';
import {ExtractJwt, Strategy} from 'passport-jwt';
import auth0Config from './auth0.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(auth0Config.KEY)
    private configService: ConfigType<typeof auth0Config>,
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: `https://${configService.domain}/.well-known/jwks.json`,
      }),
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      audience: configService.audience,
      issuer: `https://${configService.domain}/`,
      algorithms: ['RS256'],
    });
  }

  validate(payload: any) {
    return payload;
  }
}
