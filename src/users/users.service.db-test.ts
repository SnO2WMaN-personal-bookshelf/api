import {ConfigModule} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import {
  getConnectionToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import typeormConfig from '../typeorm/typeorm.config';
import {TypeORMConfigService} from '../typeorm/typeorm.service';
import {User} from './entity/user.entity';
import {UsersService} from './users.service';

describe('UsersService with connected DB', () => {
  let module: TestingModule;

  let connection: Connection;
  let usersService: UsersService;

  let usersRepogitory: Repository<User>;
  let bookshelvesRepogitory: Repository<Bookshelf>;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forFeature(typeormConfig)],
          useClass: TypeORMConfigService,
        }),
        TypeOrmModule.forFeature([User, Bookshelf]),
      ],
      providers: [UsersService],
    }).compile();

    connection = module.get<Connection>(getConnectionToken());
    usersRepogitory = module.get<Repository<User>>(getRepositoryToken(User));
    bookshelvesRepogitory = module.get<Repository<Bookshelf>>(
      getRepositoryToken(Bookshelf),
    );
    usersService = module.get<UsersService>(UsersService);
  });

  afterEach(async () => {
    await connection.synchronize(true);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepogitory).toBeDefined();
    expect(bookshelvesRepogitory).toBeDefined();
  });

  describe('signUpUser()', () => {
    it('basic', async () => {
      const newUser = await usersService.signUpUser({
        auth0Sub: 'auth0:1',
        name: 'test_user',
        displayName: 'Test Name',
        picture: 'https://example.com/test_user',
      });
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('name', 'test_user');
      expect(newUser).toHaveProperty('displayName', 'Test Name');
      expect(newUser).toHaveProperty(
        'picture',
        'https://example.com/test_user',
      );
    });

    it('given no displayName', async () => {
      const newUser = await usersService.signUpUser({
        auth0Sub: 'auth0:1',
        name: 'test_user',
        picture: 'https://example.com/test_user',
      });
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('name', 'test_user');
      expect(newUser).toHaveProperty('displayName', 'test_user');
      expect(newUser).toHaveProperty(
        'picture',
        'https://example.com/test_user',
      );
    });

    it('given no picture', async () => {
      const newUser = await usersService.signUpUser({
        auth0Sub: 'auth0:1',
        name: 'test_user',
      });
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('name', 'test_user');
      expect(newUser).toHaveProperty('displayName', 'test_user');
      expect(newUser).toHaveProperty('picture', null);
    });
  });
});
