import {Args, ID, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {BookConnection} from '../books/graphql-types/paginate.types';
import {SeriesConnection} from '../series/graphql-types/paginate.types';
import {AuthorsService} from './authors.service';
import {AuthorBooksConnectionArgs} from './dto/books.args';
import {AuthorSeriesConnectionArgs} from './dto/series.args';
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

    @Args({type: () => AuthorBooksConnectionArgs})
    connectionArgs: AuthorBooksConnectionArgs,
  ) {
    return this.authorsService.books(author, connectionArgs);
  }

  @ResolveField(() => SeriesConnection)
  async series(
    @Parent() author: Author,

    @Args({type: () => AuthorSeriesConnectionArgs})
    connectionArgs: AuthorSeriesConnectionArgs,
  ) {
    return this.authorsService.series(author, connectionArgs);
  }
}
