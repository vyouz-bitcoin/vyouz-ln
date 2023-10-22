import {
  BadRequestException,
  Inject,
  Injectable,
  forwardRef,
} from '@nestjs/common';
import { UserEntity } from './user.entity';
import { GoService } from '../integrations/go/go.service';
import { UserRepository } from './user.repository';
import { accountType } from './../../common/enums/user';
import { TransactionRepository } from '../transaction/transaction.repository';
import { WalletService } from '../wallet/wallet.service';
import Decimal from 'decimal.js';
import {
  TransactionAction,
  TransactionStatus,
  TransactionType,
} from './../../common/enums/transaction';
import { nanoid } from 'nanoid';
import { TransactionEntity } from '../transaction/transaction.entity';

@Injectable()
export class UsersService {
  constructor(
    public readonly usersRepository: UserRepository,
    public readonly goService: GoService,
    public readonly transactionRepository: TransactionRepository,
    @Inject(forwardRef(() => WalletService))
    public readonly walletService: WalletService,
  ) {}

  getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({});
  }

  async getById(id: string): Promise<UserEntity> {
    let user = {} as UserEntity;
    if (!id) return user;
    user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async checkUserExist(jwt: string): Promise<UserEntity> {
    // if we don't have user create and return
    // if we do just return
    const authUserDetails = await this.goService.getAuthDetails(jwt);
    console.log(
      '🚀 ~ file: users.service.ts:47 ~ UsersService ~ checkUserExist ~ authUserDetails:',
      authUserDetails,
    );
    const email = authUserDetails.email;
    const type =
      authUserDetails.accountType === accountType.ADVERTISER
        ? accountType.ADVERTISER
        : accountType.BLOGGER;

    const queryBuilder = this.usersRepository.createQueryBuilder('users');
    queryBuilder.where('users.email = :email', { email });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    console.log(
      '🚀 ~ file: users.service.ts:59 ~ UsersService ~ checkUserExist ~ entities:',
      entities,
    );
    // const user = await this.usersRepository.findOne({
    //   email: authUserDetails.email,
    // });
    if (entities.length > 0) {
      return entities[0];
    }

    const createdUser = await this.usersRepository.create({
      email: authUserDetails.email,
      firstName: authUserDetails.firstName,
      lastName: authUserDetails.lastName,
      country: authUserDetails.country,
      accountType: type,
      telegramChannel: authUserDetails.telegramLink,
    });
    console.log(
      '🚀 ~ file: users.service.ts:76 ~ UsersService ~ checkUserExist ~ createdUser:',
      createdUser,
    );

    return this.usersRepository.save(createdUser);
  }

  // Inside your service or repository class
  async getBloggerUsersWithTelegramLink(): Promise<UserEntity[]> {
    try {
      const bloggerUsers = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.accountType = :accountType', {
          accountType: accountType.BLOGGER,
        })
        .andWhere(
          'user.telegramChannel IS NOT NULL AND user.telegramChannel != :emptyString',
          {
            emptyString: '',
          },
        )
        .getMany();

      return bloggerUsers;
    } catch (error) {
      // Handle the error, e.g., log it or throw a custom exception
      throw error;
    }
  }

  async payout(userId: string, totalClick: number) {
    // get company wallet
    const wallet = await this.walletService.getWallets(userId);
    if (!wallet) throw new BadRequestException('Wallet not found');
    // check balance
    const balance = await this.walletService.getBalance(wallet.id);

    // we pay 1 sats for 1 click  and also turn to cents
    const topay = totalClick * 1 * 100;

    const balanceAfter = Number(new Decimal(balance).add(topay));

    const createdTransaction = this.transactionRepository.create({
      balanceAfter,
      walletId: wallet.id,
      balanceBefore: balance,
      type: TransactionType.DEBIT,
      userId: userId,
      status: TransactionStatus.SUCCESS,
      centAmount: topay,
      action: TransactionAction.CREDIT_WALLET_FOR_PAYOUT,
      description: 'payout telegram clicks',
      reference: nanoid(12),
      amount: this.convertToHighestDenomination(topay),
    } as TransactionEntity);

    return this.transactionRepository.save(createdTransaction);
  }

  convertToHighestDenomination(amount: number): number {
    amount = amount || 0;
    const rate = 100;
    return Number(new Decimal(amount).dividedBy(rate).toDecimalPlaces(2));
  }
}
