import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
@ObjectType()
export class Bookshelf {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id!: string;

  @Column({type: 'text', array: true})
  bookIDs!: string[];
}
