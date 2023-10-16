import { Body, Controller, Post, Res } from '@nestjs/common';
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
}
