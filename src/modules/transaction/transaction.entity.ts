import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';

import {
  TransactionStatus,
  TransactionType,
  TransactionAction,
} from './../../common/enums/transaction';
import { WalletEntity } from './../wallet/wallet.entity';
import { TransactionDto } from './dto/transaction.dto';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'transactions' })
export class TransactionEntity extends AbstractEntity<TransactionDto> {
  @Column({ nullable: true })
  reference: string;

  @Column({ nullable: true })
  description: string;

  @Exclude()
  @Column({ nullable: true, type: 'numeric', default: 0 })
  balanceAfter: number;

  @Exclude()
  @Column({ nullable: true, type: 'numeric', default: 0 })
  balanceBefore: number;

  @Column({ nullable: true, type: 'numeric', default: 0 })
  amount: number;

  @Column({ nullable: true, type: 'numeric', default: 0 })
  centAmount: number;

  @Column({ nullable: true, type: 'numeric', default: 0 })
  fees: number;

  @Column({ nullable: true, type: 'numeric', default: 0 })
  centFees: number;

  @Column({ nullable: true, type: 'numeric', default: 0 })
  rate: number;

  @Column({ nullable: true }) // debit, credit
  type: TransactionType;

  @Column({ nullable: true }) // processing, success, pending, failed, canceled, flagged
  status: TransactionStatus;

  @Column({ nullable: true }) // processing, success, pending, failed, canceled, flagged
  action: TransactionAction;

  @Column({ nullable: true })
  invoiceId: string;

  @Exclude()
  @Column({ nullable: true })
  callbackUrl: string;

  @Exclude()
  @Column({ nullable: true })
  walletId: string;

  // @Exclude()
  @Column({ nullable: true })
  userId: string;

  @ManyToOne(() => WalletEntity, (entity) => entity.transactions)
  wallet: WalletEntity;

  @ManyToOne(() => UserEntity, (entity) => entity.transaction)
  user: UserEntity;

  dtoClass = TransactionDto;
}
