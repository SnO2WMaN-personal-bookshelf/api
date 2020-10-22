import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {BooksService} from '../books/books.service';
import {Book} from '../books/schema/book.schema';
import {BookshelfRecordsService} from './bookshelf-records.service';
import {BookshelfRecord} from './entity/bookshelf-record.entity';

@Resolver(() => BookshelfRecord)
export class BookshelfRecordsResolver {
  constructor(
    private readonly booksService: BooksService,
    private readonly bookshelfRecordService: BookshelfRecordsService,
  ) {}

  @Query(() => BookshelfRecord, {nullable: true})
  async bookshelfRecord(@Args('id', {type: () => ID}) id: string) {
    return this.bookshelfRecordService.findOne(id);
  }

  @ResolveField((of) => Book, {nullable: false})
  async book(@Parent() {book}: BookshelfRecord) {
    return this.booksService.getBook(book).catch(() => new Error());
  }

  @Mutation((returns) => BookshelfRecord)
  async registerBookToBookshelf(
    @Args('bookshelf', {type: () => ID}) bookshelf: string,
    @Args('book', {type: () => ID}) book: string,
  ) {
    return this.bookshelfRecordService.create(bookshelf, book);
  }
}
