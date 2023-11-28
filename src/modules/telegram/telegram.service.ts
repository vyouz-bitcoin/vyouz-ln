// src/telegram/telegram.service.ts
import { Inject, Injectable, forwardRef } from '@nestjs/common';
// import { Cron } from '@nestjs/schedule';
import * as TelegramBot from 'node-telegram-bot-api';
import { UsersService } from '../users/users.service';
import { CampaignService } from '../campaign/campaign.service';
import { UrlService } from '../url/url.service';
import { shuffle } from 'lodash';

import { Telegraf } from 'telegraf';

// telegram.service.ts

@Injectable()
export class TelegramService {
  private bot: TelegramBot;

  constructor(
    public readonly userService: UsersService,
    @Inject(forwardRef(() => UrlService))
    public readonly urlService: UrlService,
    @Inject(forwardRef(() => CampaignService))
    public readonly campaignService: CampaignService,
  ) {
    this.bot = new Telegraf(process.env.TELEGRAM_TOKEN);
    this.setupHandlers();
    // this.bot = new TelegramBot(`${process.env.TELEGRAM}`, { polling: true });
  }
  private setupHandlers() {
    // Define your bot commands and event handlers here
    this.bot.start((ctx) => ctx.reply('Hello! Welcome to Vyouz Telegram bot.'));
  }

  public getBot() {
    return this.bot;
  }

  async validateTelegramChannel(channelName) {
    const chat = await this.bot.getChat(channelName);
    if (chat?.id) {
      // await this.bot.sendMessage(chat?.id, '\n ads topic  \n ads message ');
      return 'Channel Validated!';
    } else {
      return 'Group not found!';
    }
  }

  async sendAdToChannel(channelName: string, message: string) {
    const chat = await this.bot.getChat(channelName);

    await this.bot.sendMessage(chat?.id, message, { parse_mode: 'HTML' });
    console.log('message sent');
    return 'Message Sent';
  }

  // @Cron('0 0 * * * *') // Run every hour
  // @Cron('*/10 * * * * *') //ten seconds
  // @Cron('0 */1 * * * *') // minutes
  // @Cron('0 0 */12 * * *')  // 12 hours
  async sendPeriodicAd() {
    const telegramBloggers =
      await this.userService.getBloggerUsersWithTelegramLink();

    let campaigns = await this.campaignService.getActiveCampaignsWithWebsite();

    if (campaigns.length > 5) {
      campaigns = shuffle(campaigns).slice(0, 5); // Shuffle and pick random 5 campaigns
    }

    // Parallel processing of bloggers using Promise.all
    await Promise.all(
      telegramBloggers.map(async (blogger) => {
        const bloggerUrls = new Map();

        // Parallel processing of campaigns using Promise.all
        await Promise.all(
          campaigns.map(async (campaign) => {
            const existingUrl = await this.urlService.checkUrlExistsForBlogger(
              blogger.id,
              campaign.website,
            );

            if (!existingUrl) {
              const shortenedUrl = await this.urlService.createShortenedUrl(
                blogger.id,
                campaign.website,
              );
              bloggerUrls.set(campaign.website, shortenedUrl);
            } else {
              bloggerUrls.set(campaign.website, existingUrl.shortenedUrl);
            }
          }),
        );

        let messageContent = '';
        for (const [originalUrl, shortenedUrl] of bloggerUrls) {
          messageContent = `
   <b>Vyouz Campaign:</b>
    \n\n
    Please click the link below for an amazing offer:
    \n
    <a href="${shortenedUrl}">${shortenedUrl}</a>
`;
        }

        await this.sendAdToChannel(blogger.telegramChannel, messageContent);
      }),
    );
  }
  // Implement logic to track views or clicks here
}

// anytime a new ad is suppose to be sent to a channel create unique short url
// when there is a successful ln
