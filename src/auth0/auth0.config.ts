import {registerAs} from '@nestjs/config';

export default registerAs('auth0', () => ({
  audience: process.env.AUTH0_AUDIENCE!,
  issuer: process.env.AUTH0_ISSUER!,
}));
