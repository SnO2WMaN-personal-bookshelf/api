import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export class Bookshelf {
  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  books!: string[];
}
