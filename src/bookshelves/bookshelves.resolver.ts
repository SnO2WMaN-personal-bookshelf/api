import {ValidationPipe} from '@nestjs/common';
import {
  Args,
  Field,
  ID,
  Int,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {decode, encode} from 'js-base64';
import {BooksService} from '../books/books.service';
import {Book} from '../books/schema/book.schema';
import {
  FETCH_DEFAULT,
  PaginateArgsType,
} from '../common/paginate/paginate.argstype';
import {PageInfo} from '../common/paginate/paginate.entities';
import {BookshelvesService} from './bookshelves.service';
import {Bookshelf} from './entity/bookshelf.entity';

@ObjectType()
export abstract class BookEdgeType {
  @Field((type) => String)
  cursor!: string;

  @Field((type) => Book)
  node!: Book;
}

@ObjectType()
export abstract class PaginatedBook {
  @Field((type) => PageInfo)
  pageInfo!: PageInfo;

  @Field((type) => [BookEdgeType], {nullable: true})
  edges?: BookEdgeType[];

  @Field((type) => [Book], {nullable: true})
  nodes?: Book[];

  @Field((type) => Int)
  totalItems!: number;
}

@Resolver(() => Bookshelf)
export class BookshelvesResolver {
  constructor(
    private bookshelvesService: BookshelvesService,
    private booksService: BooksService,
  ) {}

  @Query(() => Bookshelf, {nullable: true})
  async bookshelf(@Args('id', {type: () => ID}) id: string) {
    return {id: '1'};
    //  return this.bookshelvesService.getBookshelf(id);
  }

  @ResolveField((of) => PaginatedBook)
  async books(
    @Parent()
    bookshelf: Bookshelf,

    @Args({type: () => PaginateArgsType}, new ValidationPipe())
    {after: afterEncoded, first = FETCH_DEFAULT}: PaginateArgsType,
  ): Promise<PaginatedBook> {
    const afterDecoed =
      (afterEncoded && parseInt(decode(afterEncoded), 10)) || 0;

    const sliced = bookshelf.bookIDs.slice(afterDecoed, afterDecoed + first);

    const hasPreviousPage = afterDecoed !== 0;
    const hasNextPage = !(sliced.length < first);

    const edges = await Promise.all(
      sliced.map(async (id, i) => ({
        cursor: encode(`${afterDecoed + i}`),
        node: await this.booksService.getBook(id),
      })),
    ).then((edges) =>
      edges.filter(
        (edge): edge is {cursor: string; node: Book} => edge.node !== null,
      ),
    );
    const nodes = edges.map(({node}) => node);

    const pageInfo: PageInfo = {
      hasPreviousPage,
      hasNextPage,
      startCursor: edges.length ? edges[0].cursor : undefined,
      endCursor: edges.length ? edges[edges.length - 1].cursor : undefined,
    };

    return {
      pageInfo,
      edges,
      nodes,
      totalItems: bookshelf.bookIDs.length,
    };
  }
}
