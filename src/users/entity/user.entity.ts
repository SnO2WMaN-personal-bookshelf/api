import {Field, ID, ObjectType} from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {Bookshelf} from '../../bookshelves/entity/bookshelf.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => ID)
  id!: string;

  @Column()
  @Field()
  name!: string;

  @OneToOne((type) => Bookshelf)
  @JoinColumn()
  @Field(() => Bookshelf)
  readBooks!: Bookshelf;
}
