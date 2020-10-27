import {Args, ID, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {BookConnection} from '../books/graphql-types/paginate.types';
import {PaginationRequiredArgs} from '../paginate/argstype/pagination-required.argstype';
import {SeriesConnection} from '../series/entity/series.entity';
import {AuthorsService} from './authors.service';
import {Author} from './entity/author.entity';

@Resolver(() => Author)
export class AuthorsResolver {
  constructor(private authorsService: AuthorsService) {}

  @Query(() => Author)
  async author(@Args('id', {type: () => ID}) id: string) {
    return this.authorsService.getById(id);
  }

  @ResolveField(() => ID)
  async id(@Parent() author: Author): Promise<string> {
    return author._id;
  }

  @ResolveField(() => BookConnection)
  async books(
    @Parent() author: Author,

    @Args({type: () => PaginationRequiredArgs})
    connectionArgs: PaginationRequiredArgs,
  ) {
    return this.authorsService.books(author, connectionArgs);
  }

  @ResolveField(() => SeriesConnection)
  async series(
    @Parent() author: Author,

    @Args({type: () => PaginationRequiredArgs})
    connectionArgs: PaginationRequiredArgs,
  ) {
    return this.authorsService.series(author, connectionArgs);
  }
}
