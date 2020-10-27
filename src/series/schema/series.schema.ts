import {Field, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {ObjectId} from 'mongodb';
import {Document} from 'mongoose';

@Schema()
@ObjectType()
export class Series extends Document {
  @Prop()
  @Field(() => String, {description: 'タイトル'})
  title!: string;

  @Prop()
  books!: {
    book: string;
    serial: number;
  }[];

  @Prop({default: []})
  relatedBooks!: string[];

  @Prop({default: false})
  @Field({description: '完結しているか'})
  concluded?: boolean;

  @Prop({default: [], required: true})
  relatedAuthors!: ObjectId[];
}
export const SeriesSchema = SchemaFactory.createForClass(Series);
