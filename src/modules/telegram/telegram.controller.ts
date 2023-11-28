// src/telegram/telegram.controller.ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import 'firebase/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { ApiTags } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';
import { Response } from 'express';
import { ValidateGroupDto } from './dto/validateGroup.dto';

@Controller('telegram')
@ApiTags('telegram')
export class TelegramController {
  private bot = new Telegraf(process.env.TELEGRAM_TOKEN);
  private firebaseService;

  constructor(private telegramService: TelegramService) {
    this.configureBot();
    this.firebaseService = new FirebaseService();
  }

  private configureBot() {
    this.bot.command('start', (ctx) => {
      console.log(ctx.from);
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Hello ${ctx.from.first_name}, \n \n Welcome to Photos by Vyouz. Here, you can shop for pictures of yourself (or anyone else) snapped at the African Bitcoin Conference and reward the photographer with SATs! 🎉. \n \n Simply click /GetStarted to start!`,
        {},
      );
    });

    this.bot.command('GetStarted', (ctx) => {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        'Please input either your name or the name of the individual for whom you wish to purchase a picture',
      );
    });

    this.bot.on('text', async (ctx) => {
      console.log('You entered:', ctx.message.text);
      // You can also send a response back to the user, if needed
      ctx.reply(
        `Checking the database for pictures featuring name: ${ctx.message.text}. Please wait...`,
      );
      const result = await this.firebaseService.getImageFromFirebase(
        ctx.message.text,
      );
      ctx.reply(
        `We found ${result.length} result(s) that match this name. Do you want more context?`,
      );
    });

    this.bot.launch();
  }

  @Post('validate-channel ')
  async createShortUrl(@Body() dto: ValidateGroupDto, @Res() res: Response) {
    const result = await this.telegramService.validateTelegramChannel(
      dto.telegramChannel,
    );

    return res.status(200).json(result);
  }
}
