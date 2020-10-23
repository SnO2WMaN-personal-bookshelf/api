import {Field, InputType} from '@nestjs/graphql';
import {OrderByDirection} from '../../paginate/order-by-direction';

@InputType()
export class BookshelfRecordOrderByInput {
  @Field((_type) => OrderByDirection, {nullable: true})
  createdAt?: OrderByDirection;

  @Field((_type) => OrderByDirection, {nullable: true})
  updatedAt?: OrderByDirection;
}
