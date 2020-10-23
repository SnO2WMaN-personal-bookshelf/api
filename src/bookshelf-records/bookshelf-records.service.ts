import {Injectable} from '@nestjs/common';
import {ArgsType, Field, Int} from '@nestjs/graphql';
import {InjectRepository} from '@nestjs/typeorm';
import {Min} from 'class-validator';
import * as Relay from 'graphql-relay';
import {FindManyOptions, Repository} from 'typeorm';
import {BooksService} from '../books/books.service';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import {BookshelfRecord} from './entity/bookshelf-record.entity';

@ArgsType()
export class ConnectionArgs implements Relay.ConnectionArguments {
  @Field((_type) => String, {
    nullable: true,
    description: 'Paginate before opaque cursor',
  })
  before?: Relay.ConnectionCursor;

  @Field((_type) => String, {
    nullable: true,
    description: 'Paginate after opaque cursor',
  })
  after?: Relay.ConnectionCursor;

  @Field((_type) => Int, {
    nullable: true,
    description: 'Paginate first',
  })
  @Min(1)
  first?: number;

  @Field((_type) => Int, {
    nullable: true,
    description: 'Paginate last',
  })
  @Min(1)
  last?: number;
}

@Injectable()
export class BookshelfRecordsService {
  constructor(
    @InjectRepository(BookshelfRecord)
    private readonly bookshelfRecordsRepository: Repository<BookshelfRecord>,

    @InjectRepository(Bookshelf)
    private readonly bookshelvesRepository: Repository<Bookshelf>,

    private readonly bookService: BooksService,
  ) {}

  async findOne(id: string) {
    return this.bookshelfRecordsRepository.findOneOrFail(id);
  }

  async create(bookshelfId: string, bookId: string): Promise<BookshelfRecord> {
    if (!this.bookService.exists(bookId)) throw Error('Unexist book');

    const bookshelf = await this.bookshelvesRepository.findOne(bookshelfId, {
      relations: ['records'],
    });

    if (!bookshelf) throw Error('Unexist bookshelf');

    return (
      bookshelf.records.find((record) => record.book === bookId) ||
      this.bookshelfRecordsRepository.save({bookshelf, book: bookId})
    );
  }

  async findAndPaginate(
    where: FindManyOptions<BookshelfRecord>['where'],
    order: FindManyOptions<BookshelfRecord>['order'],
    connArgs: ConnectionArgs,
  ) {
    const {limit, offset} = getPagingParameters(connArgs);
    const [
      entities,
      count,
    ] = await this.bookshelfRecordsRepository.findAndCount({
      where,
      order,
      skip: offset,
      take: limit,
    });
    const connection = await Relay.connectionFromArraySlice(
      entities,
      connArgs,
      {
        arrayLength: count,
        sliceStart: offset || 0,
      },
    );
    return {
      ...connection,
      aggregate: {
        count: await this.bookshelfRecordsRepository.count({where}),
      },
    };
  }
}

type PagingMeta =
  | {pagingType: 'forward'; after?: string; first: number}
  | {pagingType: 'backward'; before?: string; last: number}
  | {pagingType: 'none'};

function getMeta(args: ConnectionArgs): PagingMeta {
  const {first = 0, last = 0, after, before} = args;

  if (Boolean(first) || Boolean(after))
    return {pagingType: 'forward', after, first};
  else if (Boolean(last) || Boolean(before))
    return {pagingType: 'forward', after, first};
  else return {pagingType: 'none'};
}

export function getPagingParameters(args: ConnectionArgs) {
  const meta = getMeta(args);

  switch (meta.pagingType) {
    case 'forward': {
      return {
        limit: meta.first,
        offset: meta.after ? Relay.cursorToOffset(meta.after) + 1 : 0,
      };
    }
    case 'backward': {
      const {last, before} = meta;
      let limit = last;
      let offset = Relay.cursorToOffset(before!) - last;

      // Check to see if our before-page is underflowing past the 0th item
      if (offset < 0) {
        // Adjust the limit with the underflow value
        limit = Math.max(last + offset, 0);
        offset = 0;
      }

      return {offset, limit};
    }
    default:
      return {};
  }
}
