import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { configValidationSchema } from './config.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { CampaignModule } from './modules/campaign/campaign.module';
import { LnModule } from './modules/ln/ln.module';
import { WalletModule } from './modules/wallet/wallet.module';
import { TransactionModule } from './modules/transaction/transaction.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramModule } from './modules/telegram/telegram.module';
import { UrlModule } from './modules/url/url.module';
import { InvoiceGateway } from './modules/ln/ln.gateway';
import { SocketModule } from './socket/socket.module';
import { ClientManagerService } from './modules/ln/client-manager.service';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [`stage.${process.env.STAGE}.env`],
      validationSchema: configValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        return {
          type: 'postgres',
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
    CampaignModule,
    UsersModule,
    LnModule,
    WalletModule,
    TransactionModule,
    TelegramModule,
    UrlModule,
    SocketModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService, InvoiceGateway, ClientManagerService],
})
export class AppModule {}
