import {HttpService, Injectable} from '@nestjs/common';
import isURL from 'validator/lib/isURL';

export function dehyphenate(isbn: string) {
  return isbn.replace(/-/g, '');
}

export interface APIPayload {
  summary: {
    isbn: string;
    cover?: string;
  };
}

@Injectable()
export class OpenBDService {
  constructor(private readonly httpService: HttpService) {}

  async getCover(isbn: string): Promise<string | null> {
    return this.getCovers([isbn]).then((result) => result[dehyphenate(isbn)]);
  }

  async getCovers(isbnArray: string[]): Promise<{[x: string]: string | null}> {
    const array = isbnArray.map((isbn) => dehyphenate(isbn));
    const nulls = array.map((isbn) => [isbn, null]);

    const fetched = await this.httpService
      .get<(null | APIPayload)[]>('https://api.openbd.jp/v1/get', {
        params: {isbn: array},
      })
      .toPromise()
      .then(({data}) =>
        data
          .filter((value): value is APIPayload => Boolean(value))
          .map(({summary: {isbn, cover}}) => [
            dehyphenate(isbn),
            cover && isURL(cover) ? cover : null,
          ]),
      );

    return {
      ...Object.fromEntries(nulls),
      ...Object.fromEntries(fetched),
    };
  }
}
