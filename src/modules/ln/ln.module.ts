import { Module } from '@nestjs/common';
import { LnController } from './ln.controller';
import { LnService } from './ln.service';

@Module({
  controllers: [LnController],
  providers: [LnService],
})
export class LnModule {}
