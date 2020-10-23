import {Field, Int, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class AggregateBookshelfRecord {
  @Field((type) => Int)
  count!: number;
}
