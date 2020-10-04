import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './entity/user.entity';
import {UsersResolver} from './users.resolver';
import {UsersService} from './users.service';

describe('UsersResolver', () => {
  let usersRepogitory: Repository<User>;
  let usersService: UsersService;
  let usersResolver: UsersResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        UsersService,
        UsersResolver,
      ],
    }).compile();

    usersRepogitory = module.get<Repository<User>>(getRepositoryToken(User));
    usersService = module.get<UsersService>(UsersService);
    usersResolver = module.get<UsersResolver>(UsersResolver);
  });

  it('should be defined', () => {
    expect(usersResolver).toBeDefined();
  });

  describe('user()', () => {
    it('IDに結び付けられたUserを取得', async () => {
      jest.spyOn(usersRepogitory, 'findOne').mockResolvedValueOnce({
        id: '1',
        name: 'John',
        readBooks: {id: '1', bookIDs: []},
      });

      const user = await usersResolver.user('1');
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('readBooks');
    });

    it('IDに結び付けられたUserが存在しない場合はnullを返す', async () => {
      jest.spyOn(usersRepogitory, 'findOne').mockResolvedValueOnce(undefined);

      const user = await usersService.getUser('1');
      expect(user).toBeNull();
    });
  });
});
