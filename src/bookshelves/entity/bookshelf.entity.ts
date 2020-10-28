import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
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
}
