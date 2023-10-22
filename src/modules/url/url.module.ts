import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UrlEntity } from './url.entity';
import { UrlRepository } from './url.repository';

@Module({
  imports: [UsersModule, TypeOrmModule.forFeature([UrlEntity])],
  providers: [UrlService, UrlRepository],
  controllers: [UrlController],
  exports: [UrlService],
})
export class UrlModule {}
