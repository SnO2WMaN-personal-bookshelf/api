import {UseGuards} from '@nestjs/common';
import {Args, ID, Mutation, Query, Resolver} from '@nestjs/graphql';
import {CurrentUser} from '../auth/current-user.decorator';
import {GraphqlAuthGuard} from '../auth/graphql-auth.guard';
import {User} from './entity/user.entity';
import {UsersService} from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, {nullable: true})
  async user(@Args('id', {type: () => ID}) id: string) {
    return this.usersService.getUser(id);
  }

  @Query(() => User)
  @UseGuards(GraphqlAuthGuard)
  async currentUser(@CurrentUser() user: User) {
    return this.user(user.id);
  }

  @Mutation(() => User)
  @UseGuards(GraphqlAuthGuard)
  async createUser(@CurrentUser() user: User) {
    return (
      (await this.currentUser(user)) &&
      this.usersService.createUser({id: user.id, name: user.name})
    );
  }
}
