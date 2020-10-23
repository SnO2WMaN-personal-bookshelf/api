import {Field, ObjectType} from '@nestjs/graphql';
import {PageInfo} from '../../paginate/paginate.entities';
import {AggregateBookshelfRecord} from './aggregate.types';
import {BookshelfRecordEdgeType} from './edge.types';

@ObjectType()
export class BookshelfRecordConnection {
  @Field((type) => AggregateBookshelfRecord)
  aggregate!: AggregateBookshelfRecord;

  @Field((type) => PageInfo)
  pageInfo!: PageInfo;

  @Field((type) => [BookshelfRecordEdgeType])
  edges!: BookshelfRecordEdgeType[];
}
