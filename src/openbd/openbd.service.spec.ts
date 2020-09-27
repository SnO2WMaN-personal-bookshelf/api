import {HttpModule, HttpService} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {of} from 'rxjs';
import {OpenBDService} from './openbd.service';

describe('OpenBDService', () => {
  let service: OpenBDService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [OpenBDService],
    }).compile();

    service = module.get<OpenBDService>(OpenBDService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('ISBNに結び付けられたcoverを返す', async () => {
    jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
      of({
        data: [
          {
            summary: {
              cover: 'https://cover.openbd.jp/9784041098967.jpg',
              isbn: '9784041098967',
            },
          },
        ],
      } as any),
    );

    const actual = await service.getCovers(['9784041098967']);
    const expected = {
      '9784041098967': 'https://cover.openbd.jp/9784041098967.jpg',
    };

    await expect(actual).toStrictEqual(expected);
  });

  it('ISBNに結び付けられたcoverが存在しない場合はnullを返す', async () => {
    jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
      of({
        data: [
          {
            summary: {
              isbn: '9784041098967',
              cover: '',
            },
          },
          {
            summary: {
              isbn: '9784757558052',
            },
          },
        ],
      } as any),
    );

    const actual = await service.getCovers(['9784041098967', '9784757558052']);
    const expected = {'9784041098967': null, '9784757558052': null};

    await expect(actual).toStrictEqual(expected);
  });

  it('APIから取得した配列にnullが含まれている場合', async () => {
    jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
      of({
        data: [
          null,
          {
            summary: {
              isbn: '9784041098967',
              cover: 'https://cover.openbd.jp/9784041098967.jpg',
            },
          },
        ],
      } as any),
    );

    const actual = await service.getCovers(['9784757558052', '9784041098967']);
    const expected = {
      '9784757558052': null,
      '9784041098967': 'https://cover.openbd.jp/9784041098967.jpg',
    };

    await expect(actual).toStrictEqual(expected);
  });
});
