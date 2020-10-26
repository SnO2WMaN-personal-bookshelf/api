import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {ObjectId} from 'mongodb';
import {Model} from 'mongoose';
import {OrderByDirection} from '../paginate/enum/order-by-direction.enum';
import {Series} from './schema/series.schema';

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

  async getBooks(
    series: Series,
    order: OrderByDirection,
  ): Promise<Series['books']> {
    return this.seriesModel.aggregate([
      {
        $match: {
          _id: new ObjectId(series._id),
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
    ]);
  }

  async getRelatedBooks(series: Series) {
    return this.seriesModel.aggregate([
      {
        $match: {
          _id: new ObjectId(series._id),
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
    ]);
  }
}
