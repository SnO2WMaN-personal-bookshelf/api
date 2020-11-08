import {HttpService, Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import booksConfig from './books.config';
import {Book} from './schema/book.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,

    @Inject(booksConfig.KEY)
    private configService: ConfigType<typeof booksConfig>,

    private readonly httpService: HttpService,
  ) {}

  async getBook(id: string) {
    const book = await this.bookModel.findById(id);

    if (!book) throw new Error('Not found book');
    return book;
  }

  async getAllBooks() {
    return this.bookModel.find();
  }

  async exists(id: string): Promise<boolean> {
    return this.bookModel.exists({_id: id});
  }

  async authors(book: Book) {
    return this.bookModel.aggregate([
      {
        $match: {
          _id: book._id,
        },
      },
      {
        $unwind: {
          path: '$authors',
        },
      },
      {
        $replaceRoot: {
          newRoot: '$authors',
        },
      },
      {
        $lookup: {
          from: 'authors',
          foreignField: '_id',
          localField: 'author',
          as: 'author',
        },
      },
      {
        $unwind: {
          path: '$author',
        },
      },
    ]);
  }

  async series(book: Book) {
    return this.bookModel.aggregate([
      {
        $match: {
          _id: book._id,
        },
      },
      {
        $lookup: {
          from: 'series',
          foreignField: 'books.book',
          localField: '_id',
          as: 'series',
        },
      },
      {
        $lookup: {
          from: 'series',
          foreignField: 'relatedBooks',
          localField: '_id',
          as: 'relatedBooks',
        },
      },
      {
        $project: {
          series: {
            $concatArrays: ['$series', '$relatedBooks'],
          },
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
    ]);
  }

  async bookcover(book: Book) {
    return this.httpService
      .get<string>(this.configService.bookcoverServerUrl, {
        params: {id: book._id},
      })
      .toPromise()
      .then(({data}) => data)
      .catch((error) => {
        return null;
      });
  }
}
