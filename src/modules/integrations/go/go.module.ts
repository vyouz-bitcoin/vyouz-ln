import { Module } from '@nestjs/common';
import { GoService } from './go.service';
import { GoController } from './go.controller';

@Module({
  providers: [GoService],
  controllers: [GoController],
  exports: [GoService],
})
export class GoModule {}
