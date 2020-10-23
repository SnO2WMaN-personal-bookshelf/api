import {Args, ID, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {encode} from 'js-base64';
import {BookshelfRecordsService} from '../bookshelf-records/bookshelf-records.service';
import {BookshelfRecordConnection} from '../bookshelf-records/graphql-types/connection.types';
import {PaginateArgsType} from '../paginate/paginate.argstype';
import {PageInfo} from '../paginate/paginate.entities';
import {BookshelvesService} from './bookshelves.service';
import {Bookshelf} from './entity/bookshelf.entity';

@Resolver(() => Bookshelf)
export class BookshelvesResolver {
  constructor(
    private bookshelvesService: BookshelvesService,
    private bookshelfRecordService: BookshelfRecordsService,
  ) {}

  @Query(() => Bookshelf, {nullable: true})
  async bookshelf(@Args('id', {type: () => ID}) id: string) {
    return this.bookshelvesService.getBookshelf(id);
  }

  @ResolveField((of) => BookshelfRecordConnection)
  async recordsConnection(
    @Parent()
    bookshelf: Bookshelf,

    @Args({type: () => PaginateArgsType})
    {after: afterEncoded, first}: PaginateArgsType,
  ): Promise<BookshelfRecordConnection> {
    const edges = await Promise.all(
      bookshelf.records.map(async ({id}) => ({
        cursor: encode(id),
        node: await this.bookshelfRecordService.findOne(id),
      })),
    );

    const aggregate = {count: edges.length};

    const pageInfo: PageInfo = {
      hasPreviousPage: false,
      hasNextPage: false,
      startCursor: edges.length ? edges[0].cursor : null,
      endCursor: edges.length ? edges[edges.length - 1].cursor : null,
    };

    return {
      aggregate,
      edges,
      pageInfo,
    };
  }
}
