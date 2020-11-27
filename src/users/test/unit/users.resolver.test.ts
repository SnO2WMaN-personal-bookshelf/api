import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Bookshelf} from '../../../bookshelves/entity/bookshelf.entity';
import {CurrentUserStatus} from '../../dto/current-user.return';
import {User} from '../../entity/user.entity';
import {UsersResolver} from '../../users.resolver';
import {UsersService} from '../../users.service';

describe('UsersResolver with mocked TypeORM repository', () => {
  let module: TestingModule;

  let usersService: UsersService;
  let usersResolver: UsersResolver;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        {provide: getRepositoryToken(User), useClass: Repository},
        {provide: getRepositoryToken(Bookshelf), useClass: Repository},
        UsersService,
        UsersResolver,
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersResolver = module.get<UsersResolver>(UsersResolver);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(UsersResolver).toBeDefined();
  });

  describe('currentUser()', () => {
    it('与えられたsubに紐付けられたユーザーが存在するなら問題なく返す', async () => {
      jest.spyOn(usersService, 'getUserFromAuth0Sub').mockResolvedValueOnce({
        auth0Sub: 'auth0:1',
        id: '1',
        name: 'test_user',
        displayName: 'Display Name',
      } as User);
      const actual = await usersResolver.currentUser({sub: 'auth0:1'});

      expect(actual).toBeDefined();
      expect(actual).toHaveProperty('status', CurrentUserStatus.SignedUp);

      expect(actual.user).toBeDefined();
      expect(actual.user).toHaveProperty('auth0Sub', 'auth0:1');
      expect(actual.user).toHaveProperty('id', '1');
      expect(actual.user).toHaveProperty('name', 'test_user');
      expect(actual.user).toHaveProperty('displayName', 'Display Name');
    });

    it('与えられたsubに紐付けられたユーザーが存在しないなら未登録として返す', async () => {
      jest
        .spyOn(usersService, 'getUserFromAuth0Sub')
        .mockResolvedValueOnce(undefined);

      const actual = await usersResolver.currentUser({sub: 'auth0:1'});

      expect(actual).toBeDefined();
      expect(actual).toHaveProperty('status', CurrentUserStatus.NotSignedUp);

      expect(actual.user).not.toBeDefined();
    });
  });

  describe('createUser()', () => {
    it('UserServiceで正常にユーザーが生成出来た場合それを返す', async () => {
      jest.spyOn(usersService, 'createUser').mockResolvedValueOnce({
        auth0Sub: 'auth0:1',
        id: '1',
        name: 'test_user',
        displayName: 'Display Name',
      } as User);
      const actual = await usersResolver.createUser(
        {sub: 'auth0:1'},
        {name: 'test_user', displayName: 'Display Name'},
      );

      expect(actual).toHaveProperty('auth0Sub', 'auth0:1');
      expect(actual).toHaveProperty('id', '1');
      expect(actual).toHaveProperty('name', 'test_user');
      expect(actual).toHaveProperty('displayName', 'Display Name');
    });

    it('既に登録されたsubの場合例外を返す', async () => {
      jest
        .spyOn(usersService, 'createUser')
        .mockRejectedValueOnce(
          new Error(`User with sub auth0:1 is already signed up`),
        );

      await expect(
        usersResolver.createUser(
          {sub: 'auth0:1'},
          {name: 'test_user', displayName: 'Display Name'},
        ),
      ).rejects.toThrow(`User with sub auth0:1 is already signed up`);
    });

    it('既に登録されたnameの場合例外を返す', async () => {
      jest
        .spyOn(usersService, 'createUser')
        .mockRejectedValueOnce(
          new Error(`User name test_user is already used`),
        );

      await expect(
        usersResolver.createUser(
          {sub: 'auth0:1'},
          {name: 'test_user', displayName: 'Display Name'},
        ),
      ).rejects.toThrow(`User name test_user is already used`);
    });
  });
});
