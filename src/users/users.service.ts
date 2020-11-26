import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {Bookshelf, BookshelfType} from '../bookshelves/entity/bookshelf.entity';
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
      relations: ['userBookshelves'],
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

  async allUsers() {
    return this.usersRepository.find();
  }

  async createUser(
    sub: string,
    {
      displayName,
      ...payload
    }: {
      name: string;
      displayName?: string;
      picture?: string;
    },
  ) {
    if (await this.usersRepository.count({where: {auth0Sub: sub}}))
      throw new Error(`User with sub ${sub} is already signed up`);

    if (await this.usersRepository.count({where: {name: payload.name}}))
      throw new Error(`User name ${payload.name} is already used`);

    return this.usersRepository.save({
      auth0Sub: sub,
      ...payload,
      displayName: displayName || payload.name,
      userBookshelves: this.bookshelvesRepository.create([
        {type: BookshelfType.READ},
        {type: BookshelfType.READING},
        {type: BookshelfType.WISH},
      ]),
    });
  }

  async findBookshelfByType(
    user: User,
    type: BookshelfType.READ | BookshelfType.READING | BookshelfType.WISH,
  ): Promise<Bookshelf> {
    return this.bookshelvesRepository
      .findOneOrFail({
        where: {owner: user, type},
      })
      .catch(() => {
        throw new Error(
          `Failed to fetch the ${type.toLowerCase()} bookshelf for user: ${
            user.id
          }`,
        );
      });
  }
}
