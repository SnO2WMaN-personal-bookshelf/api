import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field((type) => String, {nullable: true})
  startCursor?: string;

  @Field((type) => String, {nullable: true})
  endCursor?: string;

  @Field((type) => Boolean)
  hasPreviousPage!: boolean;

  @Field((type) => Boolean)
  hasNextPage!: boolean;
}
