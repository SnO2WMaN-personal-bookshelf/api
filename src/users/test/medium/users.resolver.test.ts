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
import {CurrentUserStatus} from '../../dto/current-user.return';
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

  describe('readBooks(),readingBooks(),wishBooks()', () => {
    let user: User;

    beforeEach(async () => {
      user = await usersService.createUser('auth0:1', {
        name: 'test_user',
        displayName: 'Display Name',
      });
    });

    it('取得可能であることを確認', async () => {
      const readBooks = await usersResolver.readBooks(user);
      const readingBooks = await usersResolver.readingBooks(user);
      const wishBooks = await usersResolver.wishBooks(user);

      expect(readBooks).toBeDefined();
      expect(readingBooks).toBeDefined();
      expect(wishBooks).toBeDefined();
    });

    it('全て異なることを確認', async () => {
      const readBooks = await usersResolver.readBooks(user);
      const readingBooks = await usersResolver.readingBooks(user);
      const wishBooks = await usersResolver.wishBooks(user);

      expect(readBooks.id).not.toBe(readingBooks.id);
      expect(readBooks.id).not.toBe(wishBooks.id);

      expect(readingBooks.id).not.toBe(wishBooks.id);
    });
  });

  describe('createUser()', () => {
    it('createUserを呼び出してユーザーが生成される', async () => {
      const newUser = await usersResolver.createUser(
        {sub: 'auth0:1'},
        {
          name: 'test_user',
          displayName: 'Display Name',
          picture: 'https://example.com/test_user',
        },
      );

      expect(newUser).toHaveProperty('auth0Sub', 'auth0:1');
      expect(newUser).toHaveProperty('id');
      expect(newUser).toHaveProperty('name', 'test_user');
      expect(newUser).toHaveProperty('displayName', 'Display Name');
      expect(newUser).toHaveProperty(
        'picture',
        'https://example.com/test_user',
      );
    });

    it('同じsubのユーザーを作ろうとするとErrorを返す', async () => {
      await usersResolver.createUser({sub: 'auth0:1'}, {name: 'test_user_1'});
      await expect(
        usersResolver.createUser({sub: 'auth0:1'}, {name: 'test_user_2'}),
      ).rejects.toThrow('User with sub auth0:1 is already signed up');
    });

    it('同じnameのユーザーを作ろうとするとErrorを返す', async () => {
      await usersResolver.createUser({sub: 'auth0:1'}, {name: 'test_user'});
      await expect(
        usersResolver.createUser({sub: 'auth0:2'}, {name: 'test_user'}),
      ).rejects.toThrow('User name test_user is already used');
    });
  });

  describe('currentUser()', () => {
    it('UserServiceのcreateUserでユーザーを作成した後，UserResolverのcurrentUserを呼び出す', async () => {
      await usersService.createUser('auth0:1', {
        name: 'test_user',
        displayName: 'Display Name',
      });

      const actual = await usersResolver.currentUser({sub: 'auth0:1'});

      expect(actual).toBeDefined();
      expect(actual).toHaveProperty('status', CurrentUserStatus.SignedUp);

      expect(actual.user).toBeDefined();
      expect(actual.user).toHaveProperty('auth0Sub', 'auth0:1');
      expect(actual.user).toHaveProperty('name', 'test_user');
      expect(actual.user).toHaveProperty('displayName', 'Display Name');
    });

    it('UserResolverのcreateUserでユーザーを作成した後，UserResolverのcurrentUserを呼び出す', async () => {
      await usersResolver.createUser(
        {sub: 'auth0:1'},
        {
          name: 'test_user',
          displayName: 'Display Name',
          picture: 'https://example.com/test_user',
        },
      );

      const actual = await usersResolver.currentUser({sub: 'auth0:1'});

      expect(actual).toBeDefined();
      expect(actual).toHaveProperty('status', CurrentUserStatus.SignedUp);

      expect(actual.user).toBeDefined();
      expect(actual.user).toHaveProperty('auth0Sub', 'auth0:1');
      expect(actual.user).toHaveProperty('name', 'test_user');
      expect(actual.user).toHaveProperty('displayName', 'Display Name');
    });

    it('存在しないユーザーについてUserResolverのcurrentUserを呼び出すとエラー', async () => {
      const actual = await usersResolver.currentUser({sub: 'auth0:1'});

      expect(actual).toBeDefined();
      expect(actual).toHaveProperty('status', CurrentUserStatus.NotSignedUp);

      expect(actual.user).not.toBeDefined();
    });
  });
});
