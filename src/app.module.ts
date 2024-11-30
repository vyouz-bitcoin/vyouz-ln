import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { configValidationSchema } from './config.schema';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { LnModule } from './modules/ln/ln.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TelegramModule } from './modules/telegram/telegram.module';
import { InvoiceGateway } from './modules/ln/ln.gateway';
import { SocketModule } from './socket/socket.module';
import { ClientManagerService } from './modules/ln/client-manager.service';
import { QrcodeModule } from './modules/qrcode/qrcode.module';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: [`.env`],
      validationSchema: configValidationSchema,
    }),
    LnModule,
    TelegramModule,
    SocketModule,
    QrcodeModule,
  ],
  controllers: [AppController],
  providers: [AppService, InvoiceGateway, ClientManagerService],
})
export class AppModule {}
