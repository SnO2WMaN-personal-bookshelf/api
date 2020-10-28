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

  async getUserById(id: string) {
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
      .then((user) => user && this.getUserById(user.id));
  }

  async getUserFromAuth0Sub(sub: string) {
    const user = await this.usersRepository.findOne({
      where: {auth0Sub: sub},
      select: ['id'],
    });
    return user && this.getUserById(user.id);
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
    const readBooks = this.bookshelvesRepository.create({});
    const readingBooks = this.bookshelvesRepository.create({});
    const wishBooks = this.bookshelvesRepository.create({});

    const newUser = await this.usersRepository.create({
      readBooks,
      readingBooks,
      wishBooks,
      auth0Sub,
      ...payload,
    });
    return this.usersRepository.save(newUser);
  }

  async allUsers() {
    return this.usersRepository.find();
  }
}
