import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import {User} from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Bookshelf)
    private readonly bookshelvesRepository: Repository<Bookshelf>,
  ) {}

  async getUser(id: string) {
    return this.usersRepository.findOne(id, {
      relations: ['readBooks', 'readingBooks', 'wishBooks'],
    });
  }

  async getUserByName(name: string) {
    return this.usersRepository
      .findOne({
        where: {name},
        select: ['id'],
      })
      .then((user) => user && this.getUser(user.id));
  }

  async getUserFromAuth0Sub(sub: string) {
    const user = await this.usersRepository.findOne({
      where: {auth0Sub: sub},
      select: ['id'],
    });
    return user && this.getUser(user.id);
  }

  async createUser({
    sub: auth0Sub,
    ...payload
  }: {
    sub: string;
    picture?: string;
    name: string;
    displayName: string;
  }) {
    const readBooks = this.bookshelvesRepository.create({bookIDs: []});
    const readingBooks = this.bookshelvesRepository.create({bookIDs: []});
    const wishBooks = this.bookshelvesRepository.create({bookIDs: []});

    const newUser = await this.usersRepository.create({
      readBooks,
      readingBooks,
      wishBooks,
      auth0Sub,
      ...payload,
    });
    return this.usersRepository.save(newUser);
  }

  /*
  async createUser(sub: string): Promise<User | null> {
    return this.usersRepository.create({ name});
  }
  */
}
