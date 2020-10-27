import {Field, ObjectType} from '@nestjs/graphql';
import {Book} from '../../books/schema/book.schema';
import {Paginated} from '../../paginate/paginated.types';

@ObjectType()
export class SerialSeriesRecord {
  @Field(() => Number)
  serial!: number;

  @Field(() => Book)
  book!: string;
}

@ObjectType()
export class SerialSeriesRecordConnection extends Paginated(
  SerialSeriesRecord,
) {}
