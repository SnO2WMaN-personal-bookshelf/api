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
import {UsersService} from '../../users.service';

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
    it('プロパティが全てある', async () => {
      const newUser = await usersService.signUpUser('auth0:1', {
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
      expect(newUser).toHaveProperty('readBooks');
      expect(newUser).toHaveProperty('readingBooks');
      expect(newUser).toHaveProperty('wishBooks');
    });

    it('displayNameが与えられなかった場合nameで代用', async () => {
      const newUser = await usersService.signUpUser('auth0:1', {
        name: 'test_user',
        picture: 'https://example.com/test_user',
      });
      expect(newUser).toHaveProperty('name', 'test_user');
      expect(newUser).toHaveProperty('displayName', 'test_user');
    });

    it('pictureが与えられなかった場合nullになる', async () => {
      const newUser = await usersService.signUpUser('auth0:1', {
        name: 'test_user',
      });
      expect(newUser).toHaveProperty('picture', null);
    });

    it('subが重複している場合はエラーを返す', async () => {
      await usersService.signUpUser('auth0:1', {name: 'test_user_1'});

      await expect(
        usersService.signUpUser('auth0:1', {name: 'test_user_2'}),
      ).rejects.toThrow(`User with sub auth0:1 is already signed up`);
    });

    it('nameが重複している場合はエラーを返す', async () => {
      await usersService.signUpUser('auth0:1', {name: 'test_user_1'});

      await expect(
        usersService.signUpUser('auth0:2', {name: 'test_user_1'}),
      ).rejects.toThrow(`User name test_user_1 is already used`);
    });
  });
});
