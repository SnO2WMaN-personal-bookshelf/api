import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import {Bookshelf, BookshelfType} from '../bookshelves/entity/bookshelf.entity';
import {CurrentUser} from './current-user.decolator';
import {CreateUserInput} from './dto/create-user.input';
import {
  CurrentUserReturnType,
  CurrentUserStatus,
} from './dto/current-user.return';
import {User} from './entity/user.entity';
import {UsersService} from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  async user(
    @Args('id', {type: () => ID, nullable: true}) id?: string,
    @Args('name', {type: () => String, nullable: true}) name?: string,
  ) {
    if (name) {
      return this.usersService.getUserByName(name).then((user) => user || null);
    } else if (id) {
      return this.usersService.getUserById(id).then((user) => user || null);
    }

    throw new Error('Unexist user!');
  }

  @Query(() => CurrentUserReturnType)
  async currentUser(
    @CurrentUser() {sub}: {sub: string},
  ): Promise<CurrentUserReturnType> {
    return this.usersService.getUserFromAuth0Sub(sub).then((user) => ({
      status: user ? CurrentUserStatus.SignedUp : CurrentUserStatus.NotSignedUp,
      user,
    }));
  }

  @ResolveField(() => Bookshelf, {nullable: false})
  async readBooks(@Parent() user: User): Promise<Bookshelf> {
    return this.usersService.findBookshelfByType(user, BookshelfType.READ);
  }

  @ResolveField(() => Bookshelf, {nullable: false})
  async readingBooks(@Parent() user: User): Promise<Bookshelf> {
    return this.usersService.findBookshelfByType(user, BookshelfType.READING);
  }

  @ResolveField(() => Bookshelf, {nullable: false})
  async wishBooks(@Parent() user: User): Promise<Bookshelf> {
    return this.usersService.findBookshelfByType(user, BookshelfType.WISH);
  }

  @Mutation(() => User, {nullable: false})
  async createUser(
    @CurrentUser() currentUser: {sub: string},
    @Args('createUserData', {type: () => CreateUserInput})
    payload: CreateUserInput,
  ) {
    return this.usersService.createUser(currentUser.sub, payload);
  }

  @Query(() => [User])
  async allUsers() {
    return this.usersService.allUsers();
  }
}
