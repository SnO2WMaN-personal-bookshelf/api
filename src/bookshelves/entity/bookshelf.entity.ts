/* eslint-disable @shopify/typescript/prefer-pascal-case-enums */
import {Field, ID, ObjectType, registerEnumType} from '@nestjs/graphql';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {BookshelfRecord} from '../../bookshelf-records/entity/bookshelf-record.entity';
import {User} from '../../users/entity/user.entity';

export enum BookshelfType {
  READ = 'READ',
  READING = 'READING',
  WISH = 'WISH',
  CREATED = 'CREATED',
}

registerEnumType(BookshelfType, {name: 'BookshelfType'});

@Entity()
@ObjectType()
export class Bookshelf {
  @PrimaryGeneratedColumn('uuid')
  @Field((type) => ID)
  id!: string;

  @Column({nullable: true})
  @Field({nullable: true})
  title?: string;

  @Column({nullable: false})
  @Field(() => BookshelfType, {nullable: false})
  type!: BookshelfType;

  @OneToMany(() => BookshelfRecord, (record) => record.bookshelf)
  @JoinColumn()
  records!: BookshelfRecord[];

  @ManyToOne(() => User, (user) => user.userBookshelves, {
    nullable: false,
    eager: true,
  })
  @Field((type) => User)
  owner!: User;
}
