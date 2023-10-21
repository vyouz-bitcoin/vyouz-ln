import { Controller, Get, Req } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';
import { Request } from 'express';

@Controller('telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Get()
  @ApiOperation({ description: 'trigger telegram tests ' })
  getBotDialog(@Req() request: Request) {
    return this.telegramService.triggerBotTest();
    // response.status(HttpStatus.OK).send('Bot service started');
  }
}
