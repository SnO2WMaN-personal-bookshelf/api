import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './entity/user.entity';
import {UsersService} from './users.service';

describe('UsersService', () => {
  let usersRepogitory: Repository<User>;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        UsersService,
      ],
    }).compile();

    usersRepogitory = module.get<Repository<User>>(getRepositoryToken(User));
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('getUser()', () => {
    it('IDに結び付けられたユーザーを取得', async () => {
      jest.spyOn(usersRepogitory, 'findOne').mockResolvedValueOnce({
        id: '1',
        name: 'John',
        readBooks: {id: '1', bookIDs: []},
      });

      const user = await usersService.getUser('1');
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('readBooks');
    });

    it('IDに結び付けられたユーザーが存在しない場合はnullを返す', async () => {
      jest.spyOn(usersRepogitory, 'findOne').mockResolvedValueOnce(undefined);

      const user = await usersService.getUser('1');
      expect(user).toBeNull();
    });
  });
});
