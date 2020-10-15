import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Auth0Module} from '../auth0/auth0.module';
import {Bookshelf} from '../bookshelves/entity/bookshelf.entity';
import {User} from './entity/user.entity';
import {UsersResolver} from './users.resolver';
import {UsersService} from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Bookshelf]), Auth0Module],
  providers: [UsersService, UsersResolver],
})
export class UsersModule {}
