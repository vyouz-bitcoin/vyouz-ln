import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { UserDto } from './dtos/UserDto';
import { AbstractEntity } from '../../common/abstract.entity';
import { Exclude } from 'class-transformer';
import { CampaignEntity } from '../campaign/campaign.entity';
import { TransactionEntity } from '../transaction/transaction.entity';
import { UrlEntity } from '../url/url.entity';
import { accountType } from '../../common/enums/user';
import { WalletEntity } from '../wallet/wallet.entity';

@Entity({ name: 'users' })
export class UserEntity extends AbstractEntity<UserDto> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Exclude()
  @Column()
  country: string;

  @Column()
  accountType: accountType;

  @Column({ nullable: true })
  telegramChannel: string;

  @OneToMany(() => CampaignEntity, (entity) => entity.user)
  campaign: CampaignEntity[];

  @OneToMany(() => TransactionEntity, (entity) => entity.user)
  transaction: TransactionEntity[];

  @OneToOne(() => WalletEntity, (entity) => entity.user)
  wallet: WalletEntity[];

  @OneToMany(() => UrlEntity, (entity) => entity.user)
  url: UrlEntity[];

  dtoClass = UserDto;
}

//country
//email
//firstname
//lastname
//type : individual / organization
