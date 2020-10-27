import {Field, ObjectType} from '@nestjs/graphql';
import {Book} from '../../books/schema/book.schema';
import {ConnectionType} from '../../paginate/graphql-types/factory.types';

@ObjectType()
export class SerialSeriesRecord {
  @Field(() => Number)
  serial!: number;

  @Field(() => Book)
  book!: string;
}

@ObjectType()
export class SerialSeriesRecordConnection extends ConnectionType(
  SerialSeriesRecord,
) {}
