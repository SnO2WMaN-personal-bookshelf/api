import {HttpModule, HttpService} from '@nestjs/common';
import {Test, TestingModule} from '@nestjs/testing';
import {of} from 'rxjs';
import {dehyphenate, OpenBDService} from './openbd.service';

describe('utilities', () => {
  it('dehyphenate()', () => {
    expect(dehyphenate('9784041098967')).toBe('9784041098967');
    expect(dehyphenate('978-4-04-109896-7')).toBe('9784041098967');
  });
});

describe('OpenBDService', () => {
  let openBDService: OpenBDService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [OpenBDService],
    }).compile();

    openBDService = module.get<OpenBDService>(OpenBDService);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(openBDService).toBeDefined();
  });

  describe('getCovers()', () => {
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

      const actual = await openBDService.getCovers(['9784041098967']);
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

      const actual = await openBDService.getCovers([
        '9784041098967',
        '9784757558052',
      ]);
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

      const actual = await openBDService.getCovers([
        '9784757558052',
        '9784041098967',
      ]);
      const expected = {
        '9784757558052': null,
        '9784041098967': 'https://cover.openbd.jp/9784041098967.jpg',
      };

      await expect(actual).toStrictEqual(expected);
    });

    it('ハイフンが入ったISBNを渡した場合取り除く', async () => {
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

      const actual = await openBDService.getCovers(['978-4-04-109896-7']);
      const expected = {
        '9784041098967': 'https://cover.openbd.jp/9784041098967.jpg',
      };

      await expect(actual).toStrictEqual(expected);
    });

    it('API側にハイフンが入ったISBNを渡した場合取り除く', async () => {
      jest.spyOn(httpService, 'get').mockImplementationOnce(() =>
        of({
          data: [
            {
              summary: {
                cover: 'https://cover.openbd.jp/9784041098967.jpg',
                isbn: '978-4-04-109896-7',
              },
            },
          ],
        } as any),
      );

      const actual = await openBDService.getCovers(['978-4-04-109896-7']);
      const expected = {
        '9784041098967': 'https://cover.openbd.jp/9784041098967.jpg',
      };

      await expect(actual).toStrictEqual(expected);
    });
  });

  describe('getCover()', () => {
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

      const actual = await openBDService.getCover('9784041098967');
      const expected = 'https://cover.openbd.jp/9784041098967.jpg';
      await expect(actual).toBe(expected);
    });

    it('ハイフンが入っていた場合', async () => {
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

      const actual = await openBDService.getCover('978-4-04-109896-7');
      const expected = 'https://cover.openbd.jp/9784041098967.jpg';
      await expect(actual).toBe(expected);
    });
  });
});
