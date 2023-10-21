import { Injectable } from '@nestjs/common';
import { InvoiceDto } from './dto/invoice.dto';
import axios from 'axios';
import { requestInvoice } from 'lnurl-pay';
import { Satoshis } from 'lnurl-pay/dist/types/types';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const CC = require('currency-converter-lt');

@Injectable()
export class LnService {
  async generateInvoice(invoiceDto: InvoiceDto) {
    try {
      //convert the currency passed to USD
      const currencyConverter = new CC();
      const localAmount = await currencyConverter
        .from(invoiceDto.currency)
        .to('USD')
        .amount(invoiceDto.amount)
        .convert();

      const BTCVALUE = await axios({
        method: 'GET',
        url: `https://blockchain.info/tobtc?currency=USD&value=${localAmount}`,
      });

      const SATS = BTCVALUE.data * 100000000;

      const { invoice, params, successAction, validatePreimage } =
        await requestInvoice({
          lnUrlOrAddress: process.env.LN_ADDRESS,
          tokens: SATS as Satoshis,
          comment: 'lightning wallet funding',
        });
      return { invoice, params, successAction, validatePreimage };
    } catch {
      throw new Error('An error occurred while generating the invoice');
    }
  }
}
