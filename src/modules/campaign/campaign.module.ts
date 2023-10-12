import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [CampaignController],
  providers: [CampaignService],
  imports: [UsersService],
})
export class CampaignModule {}
