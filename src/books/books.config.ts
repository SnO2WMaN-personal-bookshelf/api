import {registerAs} from '@nestjs/config';

export default registerAs('books', () => ({
  bookcoverServerUrl: process.env.BOOKCOVER_SERVER!,
}));
