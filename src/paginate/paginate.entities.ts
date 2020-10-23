import {Field, ObjectType} from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field((type) => String, {nullable: true})
  startCursor!: string | null;

  @Field((type) => String, {nullable: true})
  endCursor!: string | null;

  @Field((type) => Boolean)
  hasPreviousPage!: boolean;

  @Field((type) => Boolean)
  hasNextPage!: boolean;
}
