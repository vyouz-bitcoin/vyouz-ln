import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from './../../../common/dto/PageMetaDto';
import { CampaignDto } from './campaign.dto';

export class CampaignPageDto {
  @ApiProperty({
    type: CampaignDto,
    isArray: true,
  })
  readonly campaigns: CampaignDto[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(campaigns: CampaignDto[], meta: PageMetaDto) {
    this.campaigns = campaigns;
    this.meta = meta;
  }
}
