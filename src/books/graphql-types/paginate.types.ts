import {ObjectType} from '@nestjs/graphql';
import {
  AggregateType,
  ConnectionType,
  EdgeType,
  PageInfoType,
} from '../../paginate/graphql-types/factory.types';
import {Book} from '../schema/book.schema';

@ObjectType()
export class BookAggregate extends AggregateType(Book) {}

@ObjectType()
export class BookPageInfo extends PageInfoType(Book) {}

@ObjectType()
export class BookEdgeType extends EdgeType(Book) {}

@ObjectType()
export class BookConnection extends ConnectionType(Book, {
  Aggregate: BookAggregate,
  PageInfo: BookPageInfo,
  Edge: BookEdgeType,
}) {}
