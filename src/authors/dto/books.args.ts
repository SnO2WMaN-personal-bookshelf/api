import {ArgsType} from '@nestjs/graphql';
import {BaseConnectionArgs} from '../../paginate/argstype/base-connection.argstype';

@ArgsType()
export class AuthorBooksConnectionArgs extends BaseConnectionArgs {}
