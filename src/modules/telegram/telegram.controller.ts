// src/telegram/telegram.controller.ts
import { Body, Controller, Post, Res } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import 'firebase/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { ApiTags } from '@nestjs/swagger';
import { TelegramService } from './telegram.service';
import { Response } from 'express';
import { ValidateGroupDto } from './dto/validateGroup.dto';
import { LnService } from '../ln/ln.service';
import { InvoiceDto } from '../ln/dto/invoice.dto';

@Controller('telegram')
@ApiTags('telegram')
export class TelegramController {
  private bot = new Telegraf(process.env.TELEGRAM_TOKEN);
  private firebaseService;
  private result;
  private selectedImage;

  constructor(
    private telegramService: TelegramService,
    private readonly lnService: LnService,
  ) {
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

    this.bot.command('GetContext', async (ctx) => {
      ctx.reply(`Here are the descriptions of each image result:`);
      for (let i = 0; i < this.result.length; i++) {
        ctx.reply(
          `Title: ${this.result[i].features.join(',')} \n \n Description: ${
            this.result[i].description
          } \n \n 
          To order this picture, Type ${i + 1}
          `,
        );
      }
    });

    this.bot.command('PayNow', async (ctx) => {
      const invoice = await this.lnService.generateTelegramInvoice({
        amount: this.selectedImage.amount,
        sats: this.selectedImage.amount,
        currency: 'NGN',
        socketClient: '',
      } as InvoiceDto);
      ctx.reply(
        `Kindly pay this invoice using a Lightning Wallet to complete this transaction: ${invoice.paymentRequest}`,
      );
      ctx.reply(`Waiting for your payment...`);
    });

    this.bot.on('text', async (ctx) => {
      const integerRegex = /^[0-9]+$/;
      if (integerRegex.test(ctx.message.text)) {
        this.selectedImage = this.result[parseFloat(ctx.message.text) - 1];
        ctx.reply(
          `Great, the amount for this picture is ${this.selectedImage.amount} SATs`,
        );
        ctx.reply('Are you ready to make payment? Click on /PayNow');
      } else {
        ctx.reply(
          `Checking the database for pictures featuring name: ${ctx.message.text}. Please wait...`,
        );
        this.result = await this.firebaseService.getImageFromFirebase(
          ctx.message.text.toLowerCase(),
        );
        ctx.reply(
          `We found ${this.result.length} result(s) that match this name. ${
            this.result.length > 0
              ? 'Do you want more context? /GetContext'
              : ''
          } ${this.result.length == 0 ? 'Please try another name' : ''}`,
        );
      }
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
