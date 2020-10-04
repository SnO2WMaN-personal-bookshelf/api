import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {Document} from 'mongoose';

@Schema()
@ObjectType()
export class Book extends Document {
  @Field(() => ID)
  id!: string;

  @Prop()
  @Field(() => String)
  title!: string;

  @Prop({required: false})
  @Field(() => String, {nullable: true})
  isbn?: string;
}
export const BookSchema = SchemaFactory.createForClass(Book);
