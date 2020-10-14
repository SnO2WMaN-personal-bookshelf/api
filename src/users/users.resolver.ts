import {Args, ID, Query, Resolver} from '@nestjs/graphql';
import {Auth0Identify} from '../decolators/auth0-identify.decorator';
import {CurrentUser} from '../decolators/current-user.decolator';
import {User} from './entity/user.entity';
import {UsersService} from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User, {nullable: true})
  async user(
    @Args('id', {type: () => ID, nullable: true}) id?: string,
    @Args('name', {type: () => String, nullable: true}) name?: string,
  ) {
    if (name) {
      return this.usersService.getUserByName(name).then((user) => user || null);
    } else if (id) {
      return this.usersService.getUser(id).then((user) => user || null);
    }

    return null;
  }

  @Query(() => User, {nullable: false})
  async currentUser(
    @CurrentUser() {sub}: {sub: string},
    @Auth0Identify()
    {
      picture,
      nickname,
      name,
    }: Partial<{picture: string; nickname: string; name: string}>,
  ) {
    if (!nickname || !name) {
      throw new Error();
    }

    return this.usersService.getUserFromAuth0Sub(sub, {
      picture,
      name: nickname,
      displayName: name,
    });
  }
}
