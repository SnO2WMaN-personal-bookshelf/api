import {ObjectType} from '@nestjs/graphql';
import {ConnectionType} from '../../paginate/graphql-types/factory.types';
import {BookshelfRecord} from '../entity/bookshelf-record.entity';

@ObjectType()
export class BookshelfRecordConnection extends ConnectionType(
  BookshelfRecord,
) {}
