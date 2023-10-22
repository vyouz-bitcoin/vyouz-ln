import { Exclude } from 'class-transformer';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';

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

  @Column({ nullable: true })
  active: boolean;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  currency: Currency;

  @Exclude()
  @Column({ nullable: true })
  userId: string;

  balance: any;

  @OneToOne(() => UserEntity, (entity) => entity.id)
  user: UserEntity;

  @OneToMany(() => TransactionEntity, (entity) => entity.wallet)
  transactions: TransactionEntity;

  dtoClass = WalletDto;
}
