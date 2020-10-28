import {Test, TestingModule} from '@nestjs/testing';
import {getRepositoryToken} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
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
        {
          provide: getRepositoryToken(Bookshelf),
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

  describe('getUserById()', () => {
    it('IDに結び付けられたユーザーを取得', async () => {
      jest.spyOn(usersRepogitory, 'findOne').mockResolvedValueOnce({
        id: '1',
        name: 'john',
        displayName: 'John',
        auth0Sub: '',
        picture: '',
        readBooks: {id: '1', records: []},
        readingBooks: {id: '2', records: []},
        wishBooks: {id: '3', records: []},
      });

      const user = await usersService.getUserById('1');
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('readBooks');
    });
  });
});
