import { Body, Controller, Post, Query, Res, Get } from '@nestjs/common';
import { LnService } from './ln.service';
import { InvoiceDto } from './dto/invoice.dto';
import { Response } from 'express';

@Controller('ln')
export class LnController {
  constructor(private readonly lnService: LnService) {}

  @Post('invoice')
  async generateInvoice(@Body() InvoiceDto: InvoiceDto, @Res() res: Response) {
    try {
      const result = await this.lnService.generateInvoice(InvoiceDto);
      res.status(200).json(result);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  @Get('sats')
  async getSatsValue(
    @Query('currency') currency: string,
    @Query('amount') amount: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.lnService.getSatsValue({ amount, currency });
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }

  @Get('usd')
  async getUsdValue(@Query('amount') amount: string, @Res() res: Response) {
    try {
      const response = await this.lnService.getUsdValue(amount);
      res.status(200).json(response);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
}
