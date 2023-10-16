import { Injectable } from '@nestjs/common';
import { InvoiceDto } from './dto/invoice.dto';
import axios from 'axios';
import { requestInvoice } from 'lnurl-pay';
import { Satoshis } from 'lnurl-pay/dist/types/types';

@Injectable()
export class LnService {
  async generateInvoice(invoiceDto: InvoiceDto) {
    try {
      const response = await axios({
        method: 'GET',
        url: `https://blockchain.info/tobtc?currency=${invoiceDto.currency}&value=${invoiceDto.amount}`,
      });

      const { invoice, params, successAction, validatePreimage } =
        await requestInvoice({
          lnUrlOrAddress: process.env.LN_ADDRESS,
          tokens: invoiceDto.amount as Satoshis,
          comment: 'wallet funding',
        });
      return { invoice, params, successAction, validatePreimage };
    } catch {
      throw new Error('An error occurred while generating the invoice');
    }
  }
}
