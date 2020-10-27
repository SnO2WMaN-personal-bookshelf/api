import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import * as Relay from 'graphql-relay';
import {ObjectId} from 'mongodb';
import {Model} from 'mongoose';
import {BaseConnectionArgs} from '../paginate/argstype/base-connection.argstype';
import {OrderByDirection} from '../paginate/enum/order-by-direction.enum';
import {getPagingParameters} from '../paginate/paging';
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
    connectionArgs: BaseConnectionArgs,
    order: OrderByDirection,
  ) {
    const {limit, offset: skip} = getPagingParameters(connectionArgs);

    const count: number = await this.seriesModel
      .aggregate([
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
          $count: 'count',
        },
      ])
      .then(([{count}]) => count);
    const books = await this.seriesModel.aggregate(
      [
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
        skip && {
          $skip: skip,
        },
        limit && {
          $limit: limit,
        },
      ].filter(Boolean),
    );

    const connection = Relay.connectionFromArraySlice(books, connectionArgs, {
      arrayLength: count,
      sliceStart: skip || 0,
    });
    return {
      ...connection,
      aggregate: {count},
    };
  }

  async getRelatedBooks(series: Series, connectionArgs: BaseConnectionArgs) {
    const {limit, offset: skip} = getPagingParameters(connectionArgs);

    const count: number = await this.seriesModel
      .aggregate([
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
          $count: 'count',
        },
      ])
      .then(([{count}]) => count);
    const aggregated = await this.seriesModel.aggregate(
      [
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
        skip && {
          $skip: skip,
        },
        limit && {
          $limit: limit,
        },
      ].filter(Boolean),
    );
    const connection = Relay.connectionFromArraySlice(
      aggregated,
      connectionArgs,
      {
        arrayLength: count,
        sliceStart: skip || 0,
      },
    );
    return {
      ...connection,
      aggregate: {count},
    };
  }

  async getRelatedAuthors(series: Series) {
    return this.seriesModel.aggregate([
      {
        $match: {
          _id: new ObjectId(series._id),
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
