import {ConfigModule} from '@nestjs/config';
import {Test, TestingModule} from '@nestjs/testing';
import {
  getConnectionToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';
import {Connection, Repository} from 'typeorm';
import {BookshelfRecord} from '../../../bookshelf-records/entity/bookshelf-record.entity';
import typeormConfig from '../../../typeorm/typeorm.config';
import {TypeORMConfigService} from '../../../typeorm/typeorm.service';
import {User} from '../../../users/entity/user.entity';
import {BookshelvesService} from '../../bookshelves.service';
import {Bookshelf, BookshelfType} from '../../entity/bookshelf.entity';

describe('BookshelvesService(実際にDBに接続)', () => {
  let module: TestingModule;

  let connection: Connection;

  let usersRepogitory: Repository<User>;
  let bookshelvesRepogitory: Repository<Bookshelf>;
  let bookshelfRecordRepository: Repository<BookshelfRecord>;

  let bookshelvesService: BookshelvesService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRootAsync({
          imports: [ConfigModule.forFeature(typeormConfig)],
          useClass: TypeORMConfigService,
        }),
        TypeOrmModule.forFeature([User, Bookshelf, BookshelfRecord]),
      ],
      providers: [BookshelvesService],
    }).compile();

    connection = module.get<Connection>(getConnectionToken());

    usersRepogitory = module.get<Repository<User>>(getRepositoryToken(User));
    bookshelvesRepogitory = module.get<Repository<Bookshelf>>(
      getRepositoryToken(Bookshelf),
    );
    bookshelfRecordRepository = module.get<Repository<BookshelfRecord>>(
      getRepositoryToken(Bookshelf),
    );

    bookshelvesService = module.get<BookshelvesService>(BookshelvesService);
  });

  afterEach(async () => {
    await connection.synchronize(true);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(bookshelvesService).toBeDefined();
  });

  describe('getBookshelf()', () => {
    describe('BookshelvesRepositoryから本棚を作成', () => {
      let newUser: User;
      let newBookshelf: Bookshelf;
      beforeEach(async () => {
        newUser = await usersRepogitory.save({
          auth0Sub: 'auth0:1',
          name: 'test_user',
          displayName: 'Test User',
          picture: 'https://example.com/test_user',
        });
        newBookshelf = await bookshelvesRepogitory.save({
          title: 'New Bookshelf',
          type: BookshelfType.CREATED,
          owner: newUser,
        });
      });

      it('本棚を取得してプロパティを検証', async () => {
        const actual = await bookshelvesService.getBookshelf(newBookshelf.id);

        expect(actual).toHaveProperty('id', newBookshelf.id);
        expect(actual).toHaveProperty('title', 'New Bookshelf');
        expect(actual).toHaveProperty('type', BookshelfType.CREATED);
        expect(actual).toHaveProperty('records', []);

        expect(actual).toHaveProperty('owner');
        expect(actual.owner).toBeDefined();
        expect(actual.owner).toHaveProperty('id', newUser.id);
      });

      it('存在しないIDの本棚を取得しようとするとエラー', async () => {
        await expect(
          bookshelvesService.getBookshelf(`fake_${newBookshelf.id}`),
        ).rejects.toThrow(
          `Failed to get the bookshelf with id: fake_${newBookshelf.id}`,
        );
      });
    });
  });

  describe('totalRecords()', () => {
    let newUser: User;
    let newBookshelf: Bookshelf;
    beforeEach(async () => {
      newUser = await usersRepogitory.save({
        auth0Sub: 'auth0:1',
        name: 'test_user',
        displayName: 'Test User',
        picture: 'https://example.com/test_user',
      });
      newBookshelf = await bookshelvesRepogitory.save({
        title: 'New Bookshelf',
        type: BookshelfType.CREATED,
        owner: newUser,
      });
    });

    describe('getBookshelf()で本棚を取得する', () => {
      it('何も操作が行われなければ，レコードの数は0', async () => {
        const actual = await bookshelvesService.getBookshelf(newBookshelf.id);
        expect(actual).toHaveProperty('records');
        expect(actual.records).toHaveLength(0);
      });
    });
  });
});
