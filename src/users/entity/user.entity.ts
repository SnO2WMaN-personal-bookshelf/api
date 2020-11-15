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
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id!: string;

  @Column()
  @Field()
  auth0Sub!: string;

  @Column({unique: true})
  @Field()
  name!: string;

  @Column()
  @Field()
  displayName!: string;

  @Column({nullable: true})
  @Field()
  picture!: string;

  @OneToOne((type) => Bookshelf, (bookshelf) => bookshelf.owner, {
    nullable: false,
    cascade: true,
  })
  @Field(() => Bookshelf)
  readBooks!: Bookshelf;

  @OneToOne((type) => Bookshelf, (bookshelf) => bookshelf.owner, {
    nullable: false,
    cascade: true,
  })
  @Field(() => Bookshelf)
  readingBooks!: Bookshelf;

  @OneToOne((type) => Bookshelf, (bookshelf) => bookshelf.owner, {
    nullable: false,
    cascade: true,
  })
  @Field(() => Bookshelf)
  wishBooks!: Bookshelf;
}
