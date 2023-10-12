import { Repository } from 'typeorm';
import { EntityRepository } from 'typeorm/decorator/EntityRepository';

import { CampaignEntity } from './campaign.entity';

@EntityRepository(CampaignEntity)
export class CampaignRepository extends Repository<CampaignEntity> {}
