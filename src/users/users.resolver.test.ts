import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Auth0Service} from '../auth0/auth0.service';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import {User} from './entity/user.entity';
import {UsersResolver} from './users.resolver';
import {UsersService} from './users.service';

describe('UsersResolver with mocked TypeORM repository', () => {
  let usersService: UsersService;
  let usersResolver: UsersResolver;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {provide: getRepositoryToken(User), useClass: Repository},
        {provide: getRepositoryToken(Bookshelf), useClass: Repository},
        UsersService,
        UsersResolver,
        {provide: Auth0Service, useValue: {}},
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersResolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(UsersResolver).toBeDefined();
  });

  describe('currentUser()', () => {
    it('与えられたsubに紐付けられたユーザーが存在するならそれを返す', async () => {
      jest.spyOn(usersService, 'getUserFromAuth0Sub').mockResolvedValueOnce({
        auth0Sub: 'auth0:1',
        id: '1',
        name: 'user_id',
        displayName: 'Display Name',
      } as User);
      const actual = await usersResolver.currentUser({sub: 'auth0:1'});

      expect(actual).toHaveProperty('auth0Sub', 'auth0:1');
      expect(actual).toHaveProperty('id', '1');
      expect(actual).toHaveProperty('name', 'user_id');
      expect(actual).toHaveProperty('displayName', 'Display Name');
    });

    it('与えられたsubに紐付けられたユーザーが存在しないならError発生', async () => {
      jest
        .spyOn(usersService, 'getUserFromAuth0Sub')
        .mockResolvedValueOnce(undefined);

      await expect(usersResolver.currentUser({sub: 'auth0:1'})).rejects.toThrow(
        "User auth0:1 doesn't exist",
      );
    });
  });
});
