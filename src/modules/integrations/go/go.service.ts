import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { accountType } from './../../../common/enums/user';

@Injectable()
export class GoService {
  goApi: string;

  constructor() {
    this.goApi = 'api config';
  }

  getAuthDetails(jwt: string) {
    // make a request to tobi with the jwt

    // this . request made to the backend ..............tobi backend
    return {
      firstName: 'xijing',
      lastName: 'rich',
      country: 'nigeria',
      type: 'individual',
      email: 'xijingpingn@gmail.com',
      accountType: accountType.ADVERTISER,
      telegramLink: '',
    };
  }
}
