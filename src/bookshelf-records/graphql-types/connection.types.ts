import {ObjectType} from '@nestjs/graphql';
import {
  AggregateType,
  ConnectionType,
  EdgeType,
  PageInfoType,
} from '../../paginate/graphql-types/factory.types';
import {BookshelfRecord} from '../entity/bookshelf-record.entity';

@ObjectType()
export class BookshelfRecordAggregate extends AggregateType(BookshelfRecord) {}

@ObjectType()
export class BookshelfRecordPageInfo extends PageInfoType(BookshelfRecord) {}

@ObjectType()
export class BookshelfRecordEdgeType extends EdgeType(BookshelfRecord) {}

@ObjectType()
export class BookshelfRecordConnection extends ConnectionType(BookshelfRecord, {
  Aggregate: BookshelfRecordAggregate,
  PageInfo: BookshelfRecordPageInfo,
  Edge: BookshelfRecordEdgeType,
}) {}
