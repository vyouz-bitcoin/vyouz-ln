import { Module } from '@nestjs/common';
import { TelegramController } from './telegram.controller';
import { TelegramService } from './telegram.service';
import { forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { UsersModule } from '../users/users.module';
import { CampaignModule } from '../campaign/campaign.module';
import { UrlModule } from '../url/url.module';
import { LnService } from '../ln/ln.service';
import { LnModule } from '../ln/ln.module';
import { InvoiceGateway } from '../ln/ln.gateway';
import { ClientManagerService } from '../ln/client-manager.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => CampaignModule),
    forwardRef(() => UrlModule),
    forwardRef(() => LnModule),
    UsersModule,
  ],
  controllers: [TelegramController],
  providers: [TelegramService, LnService, InvoiceGateway, ClientManagerService],
})
export class TelegramModule {}
