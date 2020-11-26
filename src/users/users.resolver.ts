import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CurrentUser} from './current-user.decolator';
import {CreateUserInput} from './dto/create-user.input';
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

  @Query(() => User, {nullable: false})
  async currentUser(@CurrentUser() {sub}: {sub: string}): Promise<User> {
    const user = await this.usersService.getUserFromAuth0Sub(sub);

    if (user) return user;
    else throw new Error(`User with sub ${sub} doesn't exist`);
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
