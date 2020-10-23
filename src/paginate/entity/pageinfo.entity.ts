import {Field, ObjectType} from '@nestjs/graphql';
import * as Relay from 'graphql-relay';

@ObjectType()
export class PageInfo implements Relay.PageInfo {
  @Field((_type) => Boolean, {nullable: true})
  hasNextPage?: boolean | null;

  @Field((_type) => Boolean, {nullable: true})
  hasPreviousPage?: boolean | null;

  @Field((_type) => String, {nullable: true})
  startCursor?: Relay.ConnectionCursor | null;

  @Field((_type) => String, {nullable: true})
  endCursor?: Relay.ConnectionCursor | null;
}
