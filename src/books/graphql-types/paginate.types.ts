import {ObjectType} from '@nestjs/graphql';
import {Paginated} from '../../paginate/paginated.types';
import {Book} from '../schema/book.schema';

@ObjectType()
export class BookConnection extends Paginated(Book) {}
