import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// check user and create user if is created (2)
// create campaigns and check if it is created (2)
// do telegram stuff and check if it works
