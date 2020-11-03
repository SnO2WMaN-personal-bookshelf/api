import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {PaginationRequiredArgs} from '../paginate/argstype/pagination-required.argstype';
import {OrderByDirection} from '../paginate/enum/order-by-direction.enum';
import {getConnectionFromMongooseModel} from '../paginate/mongoose';
import {Series} from './entity/series.entity';

@Injectable()
export class SeriesService {
  constructor(
    @InjectModel(Series.name)
    private readonly seriesModel: Model<Series>,
  ) {}

  async findById(id: string): Promise<Series> {
    const series = await this.seriesModel.findById(id);
    if (!series) throw new Error('Not Found');
    return series;
  }

  async all() {
    return this.seriesModel.find();
  }

  async books(
    series: Series,
    connectionArgs: PaginationRequiredArgs,
    order: OrderByDirection,
  ) {
    return getConnectionFromMongooseModel(
      [
        {
          $match: {
            _id: series._id,
          },
        },
        {
          $unwind: {
            path: '$books',
          },
        },
      ],
      [
        {
          $match: {
            _id: series._id,
          },
        },
        {
          $unwind: {
            path: '$books',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$books',
          },
        },
        {
          $lookup: {
            from: 'books',
            foreignField: '_id',
            localField: 'book',
            as: 'book',
          },
        },
        {
          $unwind: {
            path: '$book',
          },
        },
        {
          $sort: {
            serial: order === OrderByDirection.ASC ? 1 : -1,
          },
        },
      ],
      connectionArgs,
      this.seriesModel,
    );
  }

  async relatedBooks(series: Series, connectionArgs: PaginationRequiredArgs) {
    return getConnectionFromMongooseModel(
      [
        {
          $match: {
            _id: series._id,
          },
        },
        {
          $lookup: {
            from: 'books',
            foreignField: '_id',
            localField: 'relatedBooks',
            as: 'relatedBooks',
          },
        },
        {
          $unwind: {
            path: '$relatedBooks',
          },
        },
      ],
      [
        {
          $match: {
            _id: series._id,
          },
        },
        {
          $lookup: {
            from: 'books',
            foreignField: '_id',
            localField: 'relatedBooks',
            as: 'relatedBooks',
          },
        },
        {
          $unwind: {
            path: '$relatedBooks',
          },
        },
        {
          $replaceRoot: {
            newRoot: '$relatedBooks',
          },
        },
      ],
      connectionArgs,
      this.seriesModel,
    );
  }

  async relatedAuthors(series: Series) {
    return this.seriesModel.aggregate([
      {
        $match: {
          _id: series._id,
        },
      },
      {
        $lookup: {
          from: 'authors',
          foreignField: '_id',
          localField: 'relatedAuthors',
          as: 'relatedAuthors',
        },
      },
      {
        $unwind: {
          path: '$relatedAuthors',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$relatedAuthors',
        },
      },
    ]);
  }
}
