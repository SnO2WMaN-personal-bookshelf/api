import {Injectable} from '@nestjs/common';
import {InjectModel} from '@nestjs/mongoose';
import {Model} from 'mongoose';
import {Book} from './schema/book.schema';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name)
    private readonly bookModel: Model<Book>,
  ) {}

  async getBook(id: string): Promise<Book> {
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
}
