import {Args, ID, Query, Resolver} from '@nestjs/graphql';
import {User} from './entity/user.entity';
import {UsersService} from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, {nullable: true})
  async user(@Args('id', {type: () => ID}) id: string) {
    return this.usersService.getUser(id);
  }
}
