import {ObjectType} from '@nestjs/graphql';
import {ConnectionType} from '../../paginate/graphql-types/factory.types';
import {Book} from '../schema/book.schema';

@ObjectType()
export class BookConnection extends ConnectionType(Book) {}
