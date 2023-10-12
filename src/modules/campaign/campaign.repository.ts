import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CampaignEntity } from './campaign.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CampaignRepository extends Repository<CampaignEntity> {
  constructor(
    @InjectRepository(CampaignEntity)
    repository: Repository<CampaignEntity>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
