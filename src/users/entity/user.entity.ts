import {Field, ID, ObjectType} from '@nestjs/graphql';
import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from 'typeorm';
import {Bookshelf} from '../../bookshelves/entity/bookshelf.entity';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id!: string;

  @Column({unique: true})
  @Field()
  auth0Sub!: string;

  @Column({unique: true})
  @Field()
  name!: string;

  @Column()
  @Field()
  displayName!: string;

  @Column({nullable: true})
  @Field({nullable: true})
  picture?: string;

  @OneToMany((type) => Bookshelf, (bookshelf) => bookshelf.owner, {
    cascade: true,
  })
  @Field(() => [Bookshelf])
  userBookshelves!: Bookshelf[];
}
