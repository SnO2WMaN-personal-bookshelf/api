import {Field, ID, ObjectType} from '@nestjs/graphql';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {Bookshelf} from '../../bookshelves/entity/bookshelf.entity';

@Entity()
@ObjectType()
export class BookshelfRecord {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id!: string;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt!: Date;

  @ManyToOne((type) => Bookshelf, (bookshelf) => bookshelf.records, {
    nullable: false,
  })
  bookshelf!: Bookshelf;

  @Column({nullable: false})
  book!: string;
}
