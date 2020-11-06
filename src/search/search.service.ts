import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Author} from '../authors/entity/author.entity';
import {Book} from '../books/schema/book.schema';
import {Series} from '../series/entity/series.entity';

@Injectable()
export class SearchService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,

    @InjectModel(Author.name)
    private readonly authorModel: Model<Author>,

    @InjectModel(Series.name)
    private readonly seriesModel: Model<Series>,
  ) {}

  async searchMixed(
    query: string,
    limit: number,
  ): Promise<(Book | Series | Author)[]> {
    const rtn: (Book | Series | Author)[] = [];

    if (rtn.length < limit)
      await this.bookModel
        .find({$text: {$search: query}})
        .sort({title: 1})
        .limit(limit - rtn.length)
        .then((value) => {
          rtn.push(...value);
        });

    if (rtn.length < limit)
      await this.seriesModel
        .find({$text: {$search: query}})
        .sort({title: 1})
        .limit(limit - rtn.length)
        .then((value) => {
          rtn.push(...value);
        });

    if (rtn.length < limit)
      await this.authorModel
        .find({$text: {$search: query}})
        .sort({name: 1})
        .limit(limit - rtn.length)
        .then((value) => {
          rtn.push(...value);
        });

    return rtn;
  }
}
