import { Module } from '@nestjs/common';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { UsersService } from '../users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignEntity } from './campaign.entity';
import { CampaignRepository } from './campaign.repository';
import { UsersModule } from '../users/users.module';

@Module({
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository],
  imports: [UsersModule, TypeOrmModule.forFeature([CampaignEntity])],
})
export class CampaignModule {}
