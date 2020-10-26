import {Field, ObjectType} from '@nestjs/graphql';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
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
}
export const SeriesSchema = SchemaFactory.createForClass(Series);
