import {
  Args,
  Field,
  ID,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {Author} from '../authors/entity/author.entity';
import {OpenBDService} from '../openbd/openbd.service';
import {Series} from '../series/entity/series.entity';
import {BooksService} from './books.service';
import {Book} from './schema/book.schema';

@Resolver(() => Book)
export class BooksResolver {
  constructor(
    private bookService: BooksService,
    private openBDService: OpenBDService,
  ) {}

  @Query(() => Book, {nullable: false})
  async book(@Args('id', {type: () => ID}) id: string) {
    return this.bookService.getBook(id);
  }

  @ResolveField(() => ID)
  id(@Parent() book: Book): string {
    return book._id;
  }

  @Query(() => [Book])
  async allBooks() {
    return this.bookService.getAllBooks();
  }

  @ResolveField((of) => String, {nullable: true})
  async cover(@Parent() {isbn}: Book): Promise<string | null> {
    return isbn ? this.openBDService.getCover(isbn) : null;
  }

  @ResolveField((of) => [BookAuthorConnection])
  async authorConnections(@Parent() book: Book) {
    return this.bookService.authors(book);
  }

  @ResolveField((of) => [Series])
  async series(@Parent() book: Book) {
    return this.bookService.series(book);
  }
}

@ObjectType()
export class BookAuthorConnection {
  @Field(() => [String], {nullable: true})
  roles?: string[];

  @Field(() => Author)
  author!: Author;
}

@Resolver(() => BookAuthorConnection)
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class AuthorConnectionResolver {}
