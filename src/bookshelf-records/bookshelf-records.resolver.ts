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
import {CreateBookshelfRecordInput} from './dto/create-bookshelf-record.input';
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
    return this.booksService.getBook(book);
  }

  @Mutation((returns) => BookshelfRecord)
  async createBookshelfRecord(
    @Args('data') {book, bookshelf}: CreateBookshelfRecordInput,
  ) {
    return this.bookshelfRecordService.create(bookshelf, book);
  }
}
