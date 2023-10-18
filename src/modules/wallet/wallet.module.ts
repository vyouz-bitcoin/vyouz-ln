import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletRepository } from './wallet.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletEntity } from './wallet.entity';
import { TransactionModule } from '../transaction/transaction.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity]),
    TransactionModule,
    UsersModule,
  ],
  providers: [WalletService, WalletRepository],
  controllers: [WalletController],
  exports: [WalletService],
})
export class WalletModule {}
