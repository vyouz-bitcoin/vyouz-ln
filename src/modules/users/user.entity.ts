import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserDto } from './dtos/UserDto';
import { AbstractEntity } from '../../common/abstract.entity';
import { Exclude } from 'class-transformer';
import { CampaignEntity } from '../campaign/campaign.entity';

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
  accountType: string;

  @OneToMany(() => CampaignEntity, (entity) => entity.user)
  campaign: CampaignEntity[];

  dtoClass = UserDto;
}

//country
//email
//firstname
//lastname
//type : individual / organization
