import { Module } from '@nestjs/common';
import { LnController } from './ln.controller';
import { LnService } from './ln.service';
import { InvoiceGateway } from './ln.gateway';
import { ClientManagerService } from './client-manager.service';

@Module({
  controllers: [LnController],
  providers: [LnService, InvoiceGateway, ClientManagerService],
})
export class LnModule {}
