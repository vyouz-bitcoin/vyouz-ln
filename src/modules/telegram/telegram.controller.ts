// src/telegram/telegram.controller.ts
import {
  // Body,
  Controller,
} from '@nestjs/common';
import { Telegraf } from 'telegraf';
import 'firebase/firestore';
import { FirebaseService } from '../firebase/firebase.service';
import { ApiTags } from '@nestjs/swagger';
// import { TelegramService } from './telegram.service';
// import { Response } from 'express';
// import { ValidateGroupDto } from './dto/validateGroup.dto';
import { LnService } from '../ln/ln.service';
import { TelegramInvoiceDto } from '../ln/dto/invoice.dto';
import { TelegramImage } from './dto/telegram.dto';
import { QRCodeService } from '../qrcode/qrcode.service';

@Controller('telegram')
@ApiTags('telegram')
export class TelegramController {
  private bot = new Telegraf(process.env.TELEGRAM_TOKEN);
  private firebaseService;
  private result;
  private selectedImage: TelegramImage;
  private validatePreimage: (preimage: string) => boolean;

  constructor(
    // private telegramService: TelegramService,
    private readonly lnService: LnService,
    private readonly qrCodeService: QRCodeService,
  ) {
    this.configureBot();
    this.firebaseService = new FirebaseService();
  }

  private configureBot() {
    this.bot.command('start', (ctx) => {
      this.bot.telegram.sendMessage(
        ctx.chat.id,
        `Hello ${ctx.from.first_name} ${ctx.from.last_name}, \n \n Welcome to Photos by Vyouz. Here, you can shop for pictures of yourself (or anyone else) snapped at the African Bitcoin Conference and reward the photographer with SATs! 🎉. \n \n Simply click /GetStarted to start!`,
        {},
      );
    });

    this.bot.command('GetStarted', async (ctx) => {
      ctx.reply(
        `Checking the database for pictures featuring name: ${ctx.from.first_name} ${ctx.from.last_name}. Please wait...`,
      );
      try {
        this.result = await this.firebaseService.getImageFromFirebase(
          `${ctx.from.first_name.toLowerCase()} ${ctx.from.last_name.toLowerCase()}`,
        );
        if (this.result.length > 0) {
          ctx.reply(
            `We found ${this.result.length} result(s) that match this name. ${
              this.result.length > 0
                ? 'Do you want more context? /LearnMore'
                : ''
            } ${this.result.length == 0 ? 'Please try another name' : ''}`,
          );
        } else {
          ctx.reply(
            `We found ${this.result.length} result(s) that match this name. ${
              this.result.length > 0
                ? 'Do you want more context? /LearnMore'
                : ''
            } ${this.result.length == 0 ? 'Please try another name' : ''}`,
          );

          this.bot.telegram.sendMessage(
            ctx.chat.id,
            'Please enter either your name or the name of the individual for whom you wish to purchase a picture',
          );
        }
      } catch (error) {
        ctx.reply(
          'Sorry, something went horribly wrong 😢. Please click /start to start over',
        );
      }
    });

    this.bot.command('LearnMore', (ctx) => {
      ctx.reply(`Here are the descriptions of each image result:`);
      for (let i = 0; i < this.result.length; i++) {
        ctx.reply(
          `Title: ${this.result[i].features.join(',')} \n \n Description: ${
            this.result[i].description
          } \n  \n
          To order this picture, Type ${i + 1}
          `,
        );
      }
    });

    this.bot.command('PayNow', async (ctx) => {
      try {
        const domain = this.selectedImage.lightningAddress.split('@')[1];

        if (domain != 'getalby.com') {
          const { invoice, validatePreimage } =
            await this.lnService.generateLNInvoice({
              amount: this.selectedImage.amount,
              sats: this.selectedImage.amount,
              address: this.selectedImage.lightningAddress,
            } as TelegramInvoiceDto);
          this.validatePreimage = validatePreimage;

          ctx.reply(
            `Kindly scan/pay this invoice using a Bitcoin/Lightning Wallet to complete this transaction:`,
          );

          const filePath = 'qrcode.png';
          await this.qrCodeService.generateQRCodeFile(invoice, filePath);

          const QrcodeURL = await this.firebaseService.uploadImageToFirebase(
            filePath,
            this.selectedImage.name,
          );

          ctx.replyWithPhoto(QrcodeURL);
          ctx.reply(`${invoice}`);
          setTimeout(() => {
            ctx.reply(`Waiting for your payment...`);
            ctx.reply(`Please send payment preimage to confirm payment`);
          }, 2000);
        }

        if (domain == 'getalby.com') {
          console.log(domain);
          const invoice = await this.lnService.generateTelegramInvoice({
            amount: this.selectedImage.amount,
            sats: this.selectedImage.amount,
            address: this.selectedImage.lightningAddress,
          } as TelegramInvoiceDto);
          ctx.reply(
            `Kindly scan/pay this invoice using a Bitcoin/Lightning Wallet to complete this transaction:`,
          );

          const filePath = 'qrcode.png';
          await this.qrCodeService.generateQRCodeFile(
            invoice.paymentRequest,
            filePath,
          );

          const QrcodeURL = await this.firebaseService.uploadImageToFirebase(
            filePath,
            this.selectedImage.name,
          );

          ctx.replyWithPhoto(QrcodeURL);
          ctx.reply(`${invoice.paymentRequest}`);
          setTimeout(() => {
            ctx.reply(`Waiting for your payment...`);
          }, 2000);

          const intervalId = setInterval(async () => {
            const paid = await this.lnService.subscribeInvoice(invoice);
            if (paid) {
              clearInterval(intervalId);
              ctx.reply(`Woohoo 🎉. Your payment has been confirmed!.`);
              ctx.reply('Here is the picture you paid for: ');
              ctx
                .replyWithPhoto(this.selectedImage.image)
                .then(() => {
                  ctx.reply(
                    'Great job. Do you want to buy another picture? Click /start',
                  );
                })
                .catch(() => {
                  ctx.reply(
                    'Sorry, something went horribly wrong 😢. Please click /start to start over',
                  );
                });
            }
          }, 3000);
        }
      } catch (error) {
        ctx.reply(
          'Sorry, something went horribly wrong 😢. Please click /start to start over',
        );
      }
    });

    this.bot.on('text', async (ctx) => {
      const integerRegex = /^[0-9]+$/;
      const preImageRegex = /\b[a-fA-F0-9]{64}\b/;
      if (preImageRegex.test(ctx.message.text)) {
        const paid = this.validatePreimage(ctx.message.text);
        if (paid) {
          ctx.reply(`Woohoo 🎉. Your payment has been confirmed!.`);
          ctx.reply('Here is the picture you paid for: ');
          ctx
            .replyWithPhoto(this.selectedImage.image)
            .then(() => {
              ctx.reply(
                'Great job. Do you want to buy another picture? Click /start',
              );
            })
            .catch(() => {
              ctx.reply(
                'Sorry, something went horribly wrong 😢. Please click /start to start over',
              );
            });
        } else {
          ctx.reply('Invalid preimage sent. Please try again');
        }
        return;
      }
      if (integerRegex.test(ctx.message.text)) {
        this.selectedImage = this.result[parseFloat(ctx.message.text) - 1];
        ctx.reply(
          `Great, the price for this picture is ${this.selectedImage.amount} SATs`,
        );
        ctx.reply('Are you ready to make payment? Click on /PayNow');
      } else {
        ctx.reply(
          `Checking the database for pictures featuring name: ${ctx.message.text}. Please wait...`,
        );
        try {
          this.result = await this.firebaseService.getImageFromFirebase(
            ctx.message.text.toLowerCase(),
          );
          ctx.reply(
            `We found ${this.result.length} result(s) that match this name. ${
              this.result.length > 0
                ? 'Do you want more context? /LearnMore'
                : ''
            } ${this.result.length == 0 ? 'Please try another name' : ''}`,
          );
        } catch (error) {
          ctx.reply(
            'Sorry, something went horribly wrong 😢. Please click /start to start over',
          );
        }
      }
    });

    this.bot.launch();
  }

  // @Post('validate-channel ')
  // async createShortUrl(@Body() dto: ValidateGroupDto, @Res() res: Response) {
  //   const result = await this.telegramService.validateTelegramChannel(
  //     dto.telegramChannel,
  //   );

  //   return res.status(200).json(result);
  // }
}
