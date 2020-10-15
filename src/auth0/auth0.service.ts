import {HttpService, Inject, Injectable} from '@nestjs/common';
import {ConfigType} from '@nestjs/config';
import auth0Config from './auth0.config';

export interface UserInfo {
  sub: string;
  picture?: string;
  name: string;
  nickname: string;
}

@Injectable()
export class Auth0Service {
  constructor(
    @Inject(auth0Config.KEY)
    private configService: ConfigType<typeof auth0Config>,
    private readonly httpService: HttpService,
  ) {}

  async getIdentify(authorization: string) {
    return this.httpService
      .get(`https://${this.configService.domain}/userinfo`, {
        headers: {
          authorization,
        },
      })
      .toPromise()
      .then(({data}) => (this.validateUserInfo(data) ? data : undefined));
  }

  validateUserInfo(data: any): data is UserInfo {
    return true;
  }
}
