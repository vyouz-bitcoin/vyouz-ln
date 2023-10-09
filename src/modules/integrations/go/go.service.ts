import { Injectable } from '@nestjs/common';

@Injectable()
export class GoService {
  getHello(): string {
    return 'Hello World!';
  }
}
