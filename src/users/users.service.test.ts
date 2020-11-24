import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import {User} from './entity/user.entity';
import {UsersService} from './users.service';

describe('UsersService with mocked TypeORM repository', () => {
  let usersRepogitory: Repository<User>;
  let bookshelvesRepogitory: Repository<Bookshelf>;

  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
});
