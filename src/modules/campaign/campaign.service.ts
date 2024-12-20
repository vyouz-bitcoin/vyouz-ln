import { Injectable } from '@nestjs/common';

import { PageOptionsDto } from './../../common/dto/PageOptionsDto';
import { CampaignEntity } from './campaign.entity';
import { CreateCampaignDto } from './dto/CreateCampaign.dto';

import { CampaignPageDto } from './dto/campaignPageDto';
import { CampaignRepository } from './campaign.repository';
import { PageMetaDto } from '../../common/dto/PageMetaDto';
import { PageDto } from '../../common/dto/Page.Dto';

@Injectable()
export class CampaignService {
  constructor(public readonly campaignRepository: CampaignRepository) {}

  create(
    userId: string,
    createCampaignDto: CreateCampaignDto,
  ): Promise<CampaignEntity> {
    createCampaignDto.userId = userId;
    const campaigns = this.campaignRepository.create(createCampaignDto);
    return this.campaignRepository.save(campaigns);
  }

  async getCampaigns(userId: string, pageOptionsDto: PageOptionsDto) {
    const queryBuilder =
      this.campaignRepository.createQueryBuilder('campaigns');

    queryBuilder
      .where('campaigns.userId = :userId', { userId })
      .orderBy('campaigns.createdAt', pageOptionsDto.order)
      .skip(pageOptionsDto.skip)
      .take(pageOptionsDto.take);

    const itemCount = await queryBuilder.getCount();

    const { entities } = await queryBuilder.getRawAndEntities();

    const pageMetaDto = new PageMetaDto({ itemCount, pageOptionsDto });

    return new PageDto(entities, pageMetaDto);
  }

  // Inside your service or repository class
  async getActiveCampaignsWithWebsite(): Promise<CampaignEntity[]> {
    try {
      const currentDate = new Date();
      const activeCampaigns = await this.campaignRepository
        .createQueryBuilder('campaign')
        .where('campaign.startDate <= :currentDate', { currentDate })
        .andWhere('campaign.endDate >= :currentDate', { currentDate })
        .andWhere(
          'campaign.website IS NOT NULL AND campaign.website != :emptyString',
          {
            emptyString: '',
          },
        )
        .getMany();

      return activeCampaigns;
    } catch (error) {
      // Handle the error, e.g., log it or throw a custom exception
      throw error;
    }
  }
}
