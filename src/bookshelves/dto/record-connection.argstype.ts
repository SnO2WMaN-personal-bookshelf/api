import {ArgsType, Field} from '@nestjs/graphql';
import {ConnectionArgs} from '../../bookshelf-records/bookshelf-records.service';
import {BookshelfRecordOrderByInput} from '../../bookshelf-records/graphql-types/order-by-input.types';

@ArgsType()
export class BookshelfRecordConnectionArgs extends ConnectionArgs {
  @Field((_type) => BookshelfRecordOrderByInput, {nullable: true})
  orderBy?: BookshelfRecordOrderByInput;
}
