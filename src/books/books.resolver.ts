import {Args, ID, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {OpenBDService} from '../openbd/openbd.service';
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

  @ResolveField((of) => String, {nullable: true})
  async cover(@Parent() {isbn}: Book): Promise<string | null> {
    return isbn ? this.openBDService.getCover(isbn) : null;
  }

  @Query(() => [Book])
  async allBooks() {
    return this.bookService.getAllBooks();
  }
}
