import {ObjectType} from '@nestjs/graphql';
import {Paginated} from '../../paginate/paginated.types';
import {BookshelfRecord} from '../entity/bookshelf-record.entity';

@ObjectType()
export class BookshelfRecordConnection extends Paginated(BookshelfRecord) {}
