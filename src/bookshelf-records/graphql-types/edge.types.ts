import {Field, ObjectType} from '@nestjs/graphql';
import {BookshelfRecord} from '../entity/bookshelf-record.entity';

@ObjectType()
export class BookshelfRecordEdgeType {
  @Field((type) => String)
  cursor!: string;

  @Field((type) => BookshelfRecord)
  node!: BookshelfRecord;
}
