import {Args, ID, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import {Author} from '../authors/entity/author.entity';
import {BookConnection} from '../books/graphql-types/paginate.types';
import {PaginationRequiredArgs} from '../paginate/argstype/pagination-required.argstype';
import {OrderByDirection} from '../paginate/enum/order-by-direction.enum';
import {
  SerialSeriesRecord,
  SerialSeriesRecordConnection,
} from './entity/serial-record.entity';
import {Series} from './entity/series.entity';
import {SeriesService} from './series.service';

@Resolver(() => Series)
export class SeriesResolver {
  constructor(private seriesService: SeriesService) {}

  @Query(() => Series, {nullable: false})
  async series(@Args('id', {type: () => ID}) id: string) {
    return this.seriesService.findById(id);
  }

  @Query(() => [Series])
  async allSeries() {
    return this.seriesService.all();
  }

  @ResolveField(() => ID)
  id(@Parent() series: Series): string {
    return series._id;
  }

  @ResolveField(() => SerialSeriesRecordConnection)
  async books(
    @Parent() series: Series,

    @Args({type: () => PaginationRequiredArgs})
    connectionArgs: PaginationRequiredArgs,

    @Args('order', {type: () => OrderByDirection, nullable: true})
    order: OrderByDirection = OrderByDirection.ASC,
  ) {
    return this.seriesService.books(series, connectionArgs, order);
  }

  @ResolveField(() => BookConnection)
  async relatedBooks(
    @Parent() series: Series,

    @Args({type: () => PaginationRequiredArgs})
    connectionArgs: PaginationRequiredArgs,
  ) {
    return this.seriesService.relatedBooks(series, connectionArgs);
  }

  @ResolveField(() => [Author])
  async relatedAuthors(@Parent() series: Series) {
    return this.seriesService.relatedAuthors(series);
  }
}

@Resolver(() => SerialSeriesRecord)
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SeriesRecordResolver {}
