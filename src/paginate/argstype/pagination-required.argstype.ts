import {ArgsType, Field, Int} from '@nestjs/graphql';
import {Min} from 'class-validator';
import * as Relay from 'graphql-relay';

@ArgsType()
export class PaginationRequiredArgs implements Relay.ConnectionArguments {
  @Field((_type) => String, {
    nullable: true,
    description: 'Paginate before opaque cursor',
  })
  before?: Relay.ConnectionCursor;

  @Field((_type) => String, {
    nullable: true,
    description: 'Paginate after opaque cursor',
  })
  after?: Relay.ConnectionCursor;

  @Field((_type) => Int, {
    nullable: true,
    description: 'Paginate first',
  })
  @Min(1)
  first?: number;

  @Field((_type) => Int, {
    nullable: true,
    description: 'Paginate last',
  })
  @Min(1)
  last?: number;
}
