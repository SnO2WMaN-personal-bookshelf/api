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

  async getUserFromAuth0Sub(
    sub: string,
    payload: {
      picture?: string;
      name: string;
      displayName: string;
    },
  ) {
    const user = await this.usersRepository.findOne({
      where: {auth0Sub: sub},
      select: ['id'],
    });
    if (user) return this.getUser(user.id);
    else {
      const readBooks = this.bookshelvesRepository.create({bookIDs: []});
      const readingBooks = this.bookshelvesRepository.create({bookIDs: []});
      const wishBooks = this.bookshelvesRepository.create({bookIDs: []});

      const newUser = await this.usersRepository.create({
        auth0Sub: sub,
        readBooks,
        readingBooks,
        wishBooks,
        ...payload,
      });
      await this.usersRepository.save(newUser);
      return this.getUser(newUser.id);
    }
  }

  /*
  async createUser(sub: string): Promise<User | null> {
    return this.usersRepository.create({ name});
  }
  */
}
