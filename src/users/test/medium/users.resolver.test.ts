import {ConfigModule} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import {
  getConnectionToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {Bookshelf} from '../../../bookshelves/entity/bookshelf.entity';
import typeormConfig from '../../../typeorm/typeorm.config';
import {TypeORMConfigService} from '../../../typeorm/typeorm.service';
import {User} from '../../entity/user.entity';
import {UsersResolver} from '../../users.resolver';
import {UsersService} from '../../users.service';

describe('UsersResolver with mocked TypeORM repository', () => {
  let module: TestingModule;

  let usersService: UsersService;
  let usersResolver: UsersResolver;

  let connection: Connection;
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
      providers: [UsersService, UsersResolver],
    }).compile();

    connection = module.get<Connection>(getConnectionToken());
    usersRepogitory = module.get<Repository<User>>(getRepositoryToken(User));
    bookshelvesRepogitory = module.get<Repository<Bookshelf>>(
      getRepositoryToken(Bookshelf),
    );
    usersService = module.get<UsersService>(UsersService);
    usersResolver = module.get<UsersResolver>(UsersResolver);
  });

  afterEach(async () => {
    await connection.synchronize(true);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(UsersResolver).toBeDefined();
  });

  describe('signUpUser()', () => {
    it('signUpUserを呼び出してユーザーが生成される', async () => {
      const newUser = await usersResolver.signUpUser(
        {sub: 'auth0:1'},
        {
          name: 'user_id',
          displayName: 'Display Name',
          picture: 'https://example.com/user_id',
        },
      );

      expect(newUser).toHaveProperty('auth0Sub', 'auth0:1');
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('name', 'user_id');
      expect(newUser).toHaveProperty('displayName', 'Display Name');
      expect(newUser).toHaveProperty('picture', 'https://example.com/user_id');
    });

    it('同じsubのユーザーを作ろうとするとErrorを返す', async () => {
      await usersResolver.signUpUser({sub: 'auth0:1'}, {name: 'user_id'});
      await expect(
        usersResolver.signUpUser({sub: 'auth0:1'}, {name: 'user_id'}),
      ).rejects.toThrow('Already signed up');
    });
  });

  describe('currentUser()', () => {
    it('UserServiceのsignUpUserでユーザーを作成した後，UserResolverのcurrentUserを呼び出す', async () => {
      await usersService.signUpUser({
        auth0Sub: 'auth0:1',
        name: 'user_id',
        displayName: 'Display Name',
      });

      const actual = await usersResolver.currentUser({sub: 'auth0:1'});

      expect(actual).toHaveProperty('auth0Sub', 'auth0:1');
      expect(actual).toHaveProperty('id');
      expect(actual).toHaveProperty('name', 'user_id');
      expect(actual).toHaveProperty('displayName', 'Display Name');
    });

    it('UserResolverのsignUpUserでユーザーを作成した後，UserResolverのcurrentUserを呼び出す', async () => {
      await usersResolver.signUpUser(
        {sub: 'auth0:1'},
        {
          name: 'user_id',
          displayName: 'Display Name',
          picture: 'https://example.com/user_id',
        },
      );

      const actual = await usersResolver.currentUser({sub: 'auth0:1'});

      expect(actual).toHaveProperty('auth0Sub', 'auth0:1');
      expect(actual).toHaveProperty('id');
      expect(actual).toHaveProperty('name', 'user_id');
      expect(actual).toHaveProperty('displayName', 'Display Name');
      expect(actual).toHaveProperty('picture', 'https://example.com/user_id');
    });
  });
});
