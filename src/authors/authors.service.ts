import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {PaginationRequiredArgs} from '../paginate/argstype/pagination-required.argstype';
import {getConnectionFromMongooseModel} from '../paginate/mongoose';
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

  async all() {
    return this.authorsModel.find();
  }

  async books(author: Author, args: PaginationRequiredArgs) {
    return getConnectionFromMongooseModel(
      [
        {
          $match: {
            _id: author._id,
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
      ],
      [
        {
          $match: {
            _id: author._id,
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
      ],
      args,
      this.authorsModel,
    );
  }

  async series(author: Author, args: PaginationRequiredArgs) {
    return getConnectionFromMongooseModel(
      [
        {
          $match: {
            _id: author._id,
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
      ],
      [
        {
          $match: {
            _id: author._id,
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
      ],
      args,
      this.authorsModel,
    );
  }
}
