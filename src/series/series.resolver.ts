import {
  Args,
  Field,
  ID,
  ObjectType,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {Book} from '../books/schema/book.schema';
import {OrderByDirection} from '../paginate/enum/order-by-direction.enum';
import {Series} from './schema/series.schema';
import {SeriesService} from './series.service';

@Resolver(() => Series)
export class SeriesResolver {
  constructor(private seriesService: SeriesService) {}

  @Query(() => Series, {nullable: false})
  async series(@Args('id', {type: () => ID}) id: string) {
    return this.seriesService.findById(id);
  }

  @ResolveField(() => ID)
  id(@Parent() series: Series): string {
    return series._id;
  }

  @ResolveField(() => [SerialSeriesRecord])
  async books(
    @Parent() series: Series,
    @Args('order', {type: () => OrderByDirection, nullable: true})
    order: OrderByDirection = OrderByDirection.ASC,
  ) {
    return this.seriesService.getBooks(series, order);
  }

  @ResolveField(() => [Book])
  async relatedBooks(@Parent() series: Series) {
    return this.seriesService.getRelatedBooks(series);
  }
}

@ObjectType()
export class SerialSeriesRecord {
  @Field(() => Number)
  serial!: number;

  @Field(() => Book)
  book!: string;
}

@Resolver(() => SerialSeriesRecord)
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class SeriesRecordResolver {}
