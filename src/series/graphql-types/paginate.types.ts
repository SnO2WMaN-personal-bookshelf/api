import {ObjectType} from '@nestjs/graphql';
import {
  AggregateType,
  ConnectionType,
  EdgeType,
  PageInfoType,
} from '../../paginate/graphql-types/factory.types';
import {Series} from '../schema/series.schema';

@ObjectType()
export class SeriesAggregate extends AggregateType(Series) {}

@ObjectType()
export class SeriesPageInfo extends PageInfoType(Series) {}

@ObjectType()
export class SeriesEdgeType extends EdgeType(Series) {}

@ObjectType()
export class SeriesConnection extends ConnectionType(Series, {
  Aggregate: SeriesAggregate,
  PageInfo: SeriesPageInfo,
  Edge: SeriesEdgeType,
}) {}
