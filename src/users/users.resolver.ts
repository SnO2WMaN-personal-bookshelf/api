import {ForbiddenException} from '@nestjs/common';
import {Args, ID, Query, Resolver} from '@nestjs/graphql';
import {Auth0Service} from '../auth0/auth0.service';
import {CurrentUser} from '../decolators/current-user.decolator';
import {GraphQLHeaders} from '../decolators/graphql-headers.decorator';
import {User} from './entity/user.entity';
import {UsersService} from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private usersService: UsersService,
    private readonly auth0Service: Auth0Service,
  ) {}

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
    @GraphQLHeaders('authorization') authorization?: string,
  ) {
    const existsUser = await this.usersService.getUserFromAuth0Sub(sub);
    if (existsUser) return existsUser;

    if (authorization) {
      const identify = await this.auth0Service.getIdentify(authorization);
      if (identify) {
        return this.usersService
          .createUser({
            ...identify,
            displayName: identify.name,
            name: identify.nickname,
          })
          .then((newUser) => this.usersService.getUser(newUser.id));
      }
    }
    throw new ForbiddenException();
  }

  @Query(() => [User])
  async allUsers() {
    return this.usersService.allUsers();
  }
}
