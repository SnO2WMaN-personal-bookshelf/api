import {Field, InputType} from '@nestjs/graphql';

@InputType()
export class BookshelfRecordWhereInput {
  @Field((_type) => String, {nullable: true})
  name?: string;
}
