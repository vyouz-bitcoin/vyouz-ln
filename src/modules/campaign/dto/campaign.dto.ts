import { ApiProperty } from '@nestjs/swagger';

import { CampaignEntity } from '../campaign.entity';
import { AbstractDto } from './../../../common/dto/AbstractDto';
import { CampaignType } from '../../../common/enums/campaignType';

export class CampaignDto extends AbstractDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  satAmount: number;

  @ApiProperty()
  type: CampaignType; // image // text

  @ApiProperty()
  content: string; // image // text

  @ApiProperty()
  startDate: Date;

  @ApiProperty()
  endDate: Date;

  @ApiProperty()
  targetCountry: string;

  @ApiProperty()
  targetAge: string;

  @ApiProperty()
  targetGender: string;

  @ApiProperty()
  userId: string;
  constructor(campaign: CampaignEntity) {
    super(campaign);
    this.title = campaign.title;
    this.amount = campaign.amount;
    this.type = campaign.type;
    this.content = campaign.content;
    this.startDate = campaign.startDate;
    this.endDate = campaign.endDate;
    this.targetCountry = campaign.targetCountry;
    this.targetAge = campaign.targetAge;
    this.targetGender = campaign.targetGender;
    this.userId = campaign.userId;
  }
}
