import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';
import { CampaignModule } from '../campaign/campaign.module';
import { UrlModule } from '../url/url.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => CampaignModule),
    forwardRef(() => UrlModule),
    UsersModule,
  ],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
