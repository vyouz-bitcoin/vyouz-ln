import { Module } from '@nestjs/common';
import { forwardRef } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { LnService } from '../ln/ln.service';
import { LnModule } from '../ln/ln.module';
import { InvoiceGateway } from '../ln/ln.gateway';
import { ClientManagerService } from '../ln/client-manager.service';
import { TelegramController } from './telegram.controller';

@Module({
  imports: [ScheduleModule.forRoot(), forwardRef(() => LnModule)],
  providers: [LnService, InvoiceGateway, ClientManagerService],
  controllers: [TelegramController],
})
export class TelegramModule {}
