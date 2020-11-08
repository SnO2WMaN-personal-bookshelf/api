import {registerAs} from '@nestjs/config';

export default registerAs('typeorm', () => ({
  database: process.env.TYPEORM_DATABASE!,
  host: process.env.TYPEORM_HOST!,
  port: parseInt(process.env.TYPEORM_PORT!, 10),
  username: process.env.TYPEORM_USERNAME!,
  password: process.env.TYPEORM_PASSWORD!,
}));
