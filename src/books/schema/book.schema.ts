import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
export class Book extends Document {
  @Prop()
  title!: string;

  @Prop({required: false})
  isbn?: string;
}
export const BookSchema = SchemaFactory.createForClass(Book);
