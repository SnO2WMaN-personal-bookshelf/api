import {Module} from '@nestjs/common';
import {MongooseModule} from '@nestjs/mongoose';
import {BooksModule} from '../books/books.module';
import {Series, SeriesSchema} from './entity/series.entity';
import {SeriesRecordResolver, SeriesResolver} from './series.resolver';
import {SeriesService} from './series.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Series.name, schema: SeriesSchema}]),
    BooksModule,
  ],
  providers: [SeriesResolver, SeriesRecordResolver, SeriesService],
})
export class SeriesModule {}
