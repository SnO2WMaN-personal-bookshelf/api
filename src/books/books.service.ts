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

  async getBook(id: string) {
    return this.bookModel.findById(id);
  }

  async getAllBooks() {
    return this.bookModel.find();
  }

  async exists(id: string): Promise<boolean> {
    return this.bookModel.exists({_id: id});
  }
}
