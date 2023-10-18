import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}

// u need to have a wallet
// u need to have transactions
// to create a campaign you need to check if wallet has enough balance....and make a debit transactions
// then you need to have telegram bot as well
