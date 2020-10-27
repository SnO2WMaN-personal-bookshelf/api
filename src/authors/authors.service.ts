import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import * as Relay from 'graphql-relay';
import {ObjectId} from 'mongodb';
import {Model} from 'mongoose';
import {PaginationRequiredArgs} from '../paginate/argstype/pagination-required.argstype';
import {getPagingParameters} from '../paginate/paging';
import {Author} from './entity/author.entity';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectModel(Author.name)
    private readonly authorsModel: Model<Author>,
  ) {}

  async getById(id: string) {
    const book = await this.authorsModel.findById(id);

    if (!book) throw new Error('Not found book');
    return book;
  }

  async countBooks(author: Author): Promise<number> {
    return this.authorsModel
      .aggregate([
        {
          $match: {
            _id: new ObjectId(author._id),
          },
        },
        {
          $lookup: {
            from: 'books',
            foreignField: 'authors.author',
            localField: '_id',
            as: 'books',
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
  }

  async books(author: Author, args: PaginationRequiredArgs) {
    const {limit, offset: skip} = getPagingParameters(args);

    const count = await this.countBooks(author);
    const books = await this.authorsModel.aggregate(
      [
        {
          $match: {
            _id: new ObjectId(author._id),
          },
        },
        {
          $lookup: {
            from: 'books',
            foreignField: 'authors.author',
            localField: '_id',
            as: 'books',
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
          $sort: {
            isbn: 1,
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

    return Relay.connectionFromArraySlice(books, args, {
      arrayLength: count,
      sliceStart: skip || 0,
    });
  }

  async countSeries(author: Author): Promise<number> {
    return this.authorsModel
      .aggregate([
        {
          $match: {
            _id: new ObjectId(author._id),
          },
        },
        {
          $lookup: {
            from: 'series',
            foreignField: 'relatedAuthors',
            localField: '_id',
            as: 'series',
          },
        },
        {
          $unwind: {
            path: '$series',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $replaceRoot: {
            newRoot: '$series',
          },
        },
        {
          $count: 'count',
        },
      ])
      .then(([{count}]) => count);
  }

  async series(author: Author, args: PaginationRequiredArgs) {
    const {limit, offset: skip} = getPagingParameters(args);

    const count = await this.countSeries(author);
    const series = await this.authorsModel.aggregate(
      [
        {
          $match: {
            _id: new ObjectId(author._id),
          },
        },
        {
          $lookup: {
            from: 'series',
            foreignField: 'relatedAuthors',
            localField: '_id',
            as: 'series',
          },
        },
        {
          $unwind: {
            path: '$series',
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $replaceRoot: {
            newRoot: '$series',
          },
        },
        {
          $sort: {
            title: 1,
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

    return Relay.connectionFromArraySlice(series, args, {
      arrayLength: count,
      sliceStart: skip || 0,
    });
  }
}
