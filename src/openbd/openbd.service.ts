import {HttpService, Injectable} from '@nestjs/common';

@Injectable()
export class OpenBDService {
  constructor(private readonly httpService: HttpService) {}

  async getCovers(isbnArray: string[]): Promise<{[x: string]: string | null}> {
    const fetched = await this.httpService
      .get<(null | {summary: {isbn: string; cover?: string}})[]>(
        'https://api.openbd.jp/v1/get',
        {params: {isbn: isbnArray}},
      )
      .toPromise()
      .then(({data}) =>
        Object.fromEntries(
          (data.filter((value) => Boolean(value)) as {
            summary: {isbn: string; cover?: string};
          }[]).map(({summary: {isbn, cover}}) => [
            isbn,
            cover && cover !== '' ? cover : null,
          ]),
        ),
      );

    return {
      ...Object.fromEntries(isbnArray.map((code) => [code, null])),
      ...fetched,
    };
  }
}
