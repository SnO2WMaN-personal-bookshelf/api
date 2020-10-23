import {ArgsType, Field, InputType} from '@nestjs/graphql';
import {BaseConnectionArgs} from '../../paginate/argstype/base-connection.argstype';
import {OrderByDateInput} from '../../paginate/dto/order-by-date.input';

@InputType()
export class BookshelfRecordOrderByInput extends OrderByDateInput {}

@ArgsType()
export class BookshelfRecordConnectionArgs extends BaseConnectionArgs {
  @Field((_type) => BookshelfRecordOrderByInput, {nullable: true})
  orderBy?: BookshelfRecordOrderByInput;
}
