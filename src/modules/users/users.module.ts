import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { GoModule } from '../integrations/go/go.module';
import { UserRepository } from './user.repository';
import { TransactionModule } from '../transaction/transaction.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [
    GoModule,
    TransactionModule,
    TypeOrmModule.forFeature([UserEntity]),
    WalletModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  exports: [UsersService],
})
export class UsersModule {}
