import { Injectable } from '@nestjs/common';
import { UsersService } from '../../users/users.service';

@Injectable()
export class GoService {
  goApi: string;

  constructor(public readonly userService: UsersService) {
    this.goApi = 'api config';
  }

  getAuthDetails(jwt: string) {
    // make a request to tobi with the jwt

    // this . request made to the backend ..............tobi backend
    return {
      firstName: 'adigun',
      lastName: 'john',
      country: 'nigeria',
      type: 'individual',
      email: 'segun@gmail.com',
    };
  }
}
