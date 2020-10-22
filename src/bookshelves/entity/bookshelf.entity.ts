import {Field, ID, ObjectType} from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {BookshelfRecord} from '../../bookshelf-records/entity/bookshelf-record.entity';

@Entity()
@ObjectType()
export class Bookshelf {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id!: string;

  @OneToMany(() => BookshelfRecord, (record) => record.bookshelf)
  @JoinColumn()
  records!: BookshelfRecord[];

  @Column({type: 'text', array: true})
  bookIDs!: string[];
}
