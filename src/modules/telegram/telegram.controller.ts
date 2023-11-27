import { Controller } from '@nestjs/common';
@Controller('telegram')
export class TelegramController {}
import { Controller, Get, Req, Post, Body, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';
import { Request, Response } from 'express';
import { ValidateGroupDto } from './dto/validateGroup.dto';

@Controller('telegram')
@ApiTags('telegram')
export class TelegramController {
  constructor(private telegramService: TelegramService) {}

  @Post('validate-channel ')
  async createShortUrl(@Body() dto: ValidateGroupDto, @Res() res: Response) {
    const result = await this.telegramService.validateTelegramChannel(
      dto.telegramChannel,
    );

    return res.status(200).json(result);
  }
}
