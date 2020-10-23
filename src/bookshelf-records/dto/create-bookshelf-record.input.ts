import {Field, ID, InputType} from '@nestjs/graphql';

@InputType()
export class CreateBookshelfRecordInput {
  @Field(() => ID, {nullable: false})
  bookshelf!: string;

  @Field(() => ID, {nullable: false})
  book!: string;
}
