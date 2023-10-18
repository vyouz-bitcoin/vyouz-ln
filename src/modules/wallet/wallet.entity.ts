import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';

import { Currency } from './../../common/enums/currency';
// import { TransactionEntity } from './../transaction/transaction.entity';
import { WalletDto } from './dto/wallet.dto';
import { UserEntity } from '../users/user.entity';
import { TransactionEntity } from '../transaction/transaction.entity';

@Entity({ name: 'wallets' })
export class WalletEntity extends AbstractEntity<WalletDto> {
  @Column({ nullable: true })
  name: string;

  @Exclude()
  @Column({ nullable: true })
  userId: string;

  @Column({ nullable: true })
  active: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  currency: Currency;

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  company: UserEntity;

  balance: any;

  @OneToMany(() => TransactionEntity, (entity) => entity.wallet)
  transactions: TransactionEntity;

  dtoClass = WalletDto;
}
