import { Column, Entity, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { CampaignDto } from './dto/campaign.dto';
import { CampaignType } from '../../common/enums/campaignType';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'campaigns' })
export class CampaignEntity extends AbstractEntity<CampaignDto> {
  @Column({ nullable: false })
  title: string;

  @Column({ nullable: false })
  amount: number;

  @Column({ nullable: false })
  satAmount: number;

  @Column({ nullable: false })
  type: CampaignType; // image // text

  @Column({ nullable: false })
  content: string; // image // text

  @Column({ nullable: false })
  startDate: Date;

  @Column({ nullable: false })
  endDate: Date;

  @Column({ nullable: false })
  targetCountry: string;

  @Column({ nullable: false })
  targetAge: string;

  @Column({ nullable: false })
  targetGender: string;

  @Column({ nullable: false })
  website: string;

  @Column({ nullable: false })
  userId: string;
  //  relations

  @ManyToOne(() => UserEntity, (entity) => entity.id)
  user: UserEntity;
  dtoClass = CampaignDto;
}
