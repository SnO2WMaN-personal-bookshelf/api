import {Injectable} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './entity/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async getUser(id: string): Promise<User | null> {
    return this.usersRepository
      .findOne(id, {relations: ['readBooks', 'readingBooks', 'wishBooks']})
      .then((user) => user || null);
  }

  async createUser({
    id,
    name,
  }: {
    id: string;
    name: string;
  }): Promise<User | null> {
    return this.usersRepository.create({id, name});
  }
}
