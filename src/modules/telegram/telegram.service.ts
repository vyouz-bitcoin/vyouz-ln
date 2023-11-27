// src/telegram/telegram.service.ts

import { Injectable } from '@nestjs/common';
import { Telegraf } from 'telegraf';

@Injectable()
export class TelegramService {
  private bot;

  constructor() {
    this.bot = new Telegraf('6548853489:AAHuLmXt6-J1h2FTbxVtUIvdoCAVb9TuYQo');

    this.setupHandlers();
  }

  private setupHandlers() {
    // Define your bot commands and event handlers here
    this.bot.start((ctx) => ctx.reply('Hello! Welcome to Vyouz Telegram bot.'));
  }

  public getBot() {
    return this.bot;
  }
}
