import { Injectable } from '@nestjs/common';
import { Currency } from '../../common/enums/currency';
import { WalletEntity } from './wallet.entity';
import { WalletRepository } from './wallet.repository';
import { Decimal } from 'decimal.js';
import {
  TransactionStatus,
  TransactionType,
} from 'src/common/enums/transaction';
import { Any } from 'typeorm';
import { UsersService } from '../users/users.service';
import { TransactionRepository } from '../transaction/transaction.repository';

@Injectable()
@Injectable()
export class WalletService {
  wallets = [
    {
      name: 'USD Wallet',
      currency: Currency.USD,
      description: 'USD Wallet for Company',
    },
  ] as any;

  constructor(
    public readonly walletRepository: WalletRepository,
    public readonly transactionRepository: TransactionRepository,
    public readonly userService: UsersService,
  ) {}

  async getWallets(userId: string): Promise<WalletEntity[]> {
    // create default wallet(s) if not existing
    await this.createInitialWallets(userId);

    // TODO: query only active wallets
    const wallets = await this.walletRepository.find({
      where: {
        userId,
        active: true,
      },
      order: { createdAt: 'ASC' },
    });

    // Get fiat usd wallet balance
    const usdWalletIndex = this._getWalletIndex(wallets, Currency.USD);
    wallets[usdWalletIndex].balance = await this.getUsdWalletBalance(
      userId,
      wallets,
    );

    return wallets;
  }
  async getUsdWalletBalance(
    userId: string,
    wallets: WalletEntity[],
  ): Promise<{ usd: number }> {
    const fiatWallet = wallets.find(
      (wallet: WalletEntity) => wallet.currency === Currency.USD,
    );

    if (!fiatWallet) await this.createInitialWallets(userId);
    const cents = await this.getBalance(fiatWallet.id);
    const usd = this.convertToHighestDenomination(cents);

    return { usd };
  }

  async createInitialWallets(userId: string): Promise<void> {
    // const user = await this.userService.getById(userId);
    for await (const wallet of this.wallets) {
      wallet.userId = userId;
      wallet.active = true;
      const dbWallet = await this.walletRepository.findOneBy({
        userId,
        currency: wallet.currency,
      });
      if (!dbWallet) {
        const savedWallet = this.walletRepository.create(wallet);
        await this.walletRepository.save(savedWallet);
      }
    }
  }

  async getBalance(walletId: string) {
    let credit = 0;
    let debit = 0;

    const statuses = [
      TransactionStatus.PROCESSING,
      TransactionStatus.PENDING,
      TransactionStatus.SUCCESS,
    ];

    const creditResponse = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.centAmount)', 'credit')
      .addSelect('SUM(transaction.centFees)', 'fees')
      .where({
        walletId,
        type: TransactionType.CREDIT,
        status: TransactionStatus.SUCCESS,
      })
      .getRawOne();

    const debitResponse = await this.transactionRepository
      .createQueryBuilder('transaction')
      .select('SUM(transaction.centAmount)', 'debit')
      .addSelect('SUM(transaction.centFees)', 'fees')
      .where({ walletId, type: TransactionType.DEBIT, status: Any(statuses) })
      .getRawOne();

    if (debitResponse) {
      debit = Number(
        new Decimal(debitResponse.debit || 0).plus(debitResponse.fees || 0),
      );
    }

    if (creditResponse) {
      credit = Number(
        new Decimal(creditResponse.credit || 0).minus(creditResponse.fees || 0),
      );
    }

    return Number(new Decimal(credit).minus(debit));
  }

  convertToLowestDenomination(amount: number): number {
    amount = amount || 0;
    const rate = 100;
    return Number(new Decimal(amount).times(rate).round());
  }

  convertToHighestDenomination(amount: number): number {
    amount = amount || 0;
    const rate = 100;
    return Number(new Decimal(amount).dividedBy(rate).toDecimalPlaces(2));
  }

  private _getWalletIndex(wallets: WalletEntity[], currency: Currency) {
    const wallet = wallets.find((w) => w.currency === currency);
    return wallets.indexOf(wallet);
  }
}
