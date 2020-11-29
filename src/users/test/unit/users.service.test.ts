import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import * as jdenticon from 'jdenticon';
import {Repository} from 'typeorm';
import {Bookshelf} from '../../../bookshelves/entity/bookshelf.entity';
import {User} from '../../entity/user.entity';
import {UsersService} from '../../users.service';

describe('UsersService with mocked TypeORM repository', () => {
  let module: TestingModule;

  let usersRepogitory: Repository<User>;
  let bookshelvesRepogitory: Repository<Bookshelf>;

  let usersService: UsersService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      providers: [
        {provide: getRepositoryToken(User), useClass: Repository},
        {provide: getRepositoryToken(Bookshelf), useClass: Repository},
        UsersService,
      ],
    }).compile();

    usersRepogitory = module.get<Repository<User>>(getRepositoryToken(User));
    bookshelvesRepogitory = module.get<Repository<Bookshelf>>(
      getRepositoryToken(Bookshelf),
    );
    usersService = module.get<UsersService>(UsersService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('createUser()', () => {
    it('既に登録されたsubの場合例外を返す', async () => {
      jest.spyOn(usersRepogitory, 'count').mockResolvedValueOnce(1);

      await expect(
        usersService.createUser('auth0:1', {
          name: 'test_user',
          displayName: 'Display Name',
        }),
      ).rejects.toThrow(`User with sub auth0:1 is already signed up`);
    });

    it('既に登録されたnameの場合例外を返す', async () => {
      jest
        .spyOn(usersRepogitory, 'count')
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(1);

      await expect(
        usersService.createUser('auth0:1', {
          name: 'test_user',
          displayName: 'Display Name',
        }),
      ).rejects.toThrow(`User name test_user is already used`);
    });
  });

  describe('ensurePicture()', () => {
    it('ある場合はその値を返す', () => {
      const actual = usersService.ensurePicture({
        name: 'test_user',
        picture: 'https://example.com/test_user',
      });
      expect(actual).toBe('https://example.com/test_user');
    });

    it('ない場合はnameから生成される一意の値を返す', () => {
      jest
        .spyOn(jdenticon, 'toPng')
        .mockImplementationOnce(() => Buffer.from('mocked'));

      const actual = usersService.ensurePicture({
        name: 'test_user',
      });

      expect(actual).toBe(
        `data:image/png;base64,${Buffer.from('mocked').toString('base64')}`,
      );
    });
  });
});
