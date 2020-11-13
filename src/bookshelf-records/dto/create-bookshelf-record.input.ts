import {ArgsType, Field, ID} from '@nestjs/graphql';

@ArgsType()
export class CreateBookshelfRecordInput {
  @Field(() => ID, {nullable: false})
  bookshelf!: string;

  @Field(() => ID, {nullable: false})
  book!: string;
}
