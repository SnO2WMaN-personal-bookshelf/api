import {Args, createUnionType, Int, Query, Resolver} from '@nestjs/graphql';
import {Author} from '../authors/entity/author.entity';
import {Book} from '../books/schema/book.schema';
import {Series} from '../series/entity/series.entity';
import {SearchService} from './search.service';

export const MixedSearchResultUnion = createUnionType({
  name: 'MixedSearchResult',
  types: () => [Author, Series, Book],
  resolveType(value) {
    switch (value.collection.name) {
      case 'books':
        return Book;
      case 'authors':
        return Author;
      case 'series':
        return Series;
    }
    return null;
  },
});

@Resolver()
export class SearchResolver {
  constructor(private readonly searchService: SearchService) {}

  @Query(() => [MixedSearchResultUnion])
  async search(
    @Args('query', {type: () => String}) query: string,
    @Args('limit', {type: () => Int}) limit: number,
  ) {
    return this.searchService.searchMixed(query, limit);
  }
}
