import {CanActivate, ExecutionContext, Injectable} from '@nestjs/common';
import {GqlExecutionContext} from '@nestjs/graphql';
import {Auth0Service} from '../auth0/auth0.service';

@Injectable()
export class GraphQLAuth0IdentifyGuard implements CanActivate {
  constructor(private readonly auth0Service: Auth0Service) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const {req} = ctx.getContext();

    const identify = await this.auth0Service.getIdentify(
      req.headers.authorization,
    );
    req.auth0Identify = identify;

    return Boolean(identify);
  }
}
