import { Injectable } from '@nestjs/common';
import { InvoiceDto } from './dto/invoice.dto';
import axios from 'axios';
import { requestInvoice } from 'lnurl-pay';
import { Satoshis } from 'lnurl-pay/dist/types/types';
import { AmountDto } from './dto/amount.dto';
const CC = require('currency-converter-lt');

@Injectable()
export class LnService {
  async generateInvoice(invoiceDto: InvoiceDto) {
    try {
      //convert the currency passed to USD
      let currencyConverter = new CC();
      let localAmount = await currencyConverter
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

  async getSatsValue(amountDto: AmountDto) {
    try {
      let currencyConverter = new CC();
      let localAmount = await currencyConverter
        .from(amountDto.currency)
        .to('USD')
        .amount(parseFloat(amountDto.amount))
        .convert();

      const BTCVALUE = await axios({
        method: 'GET',
        url: `https://blockchain.info/tobtc?currency=USD&value=${localAmount}`,
      });

      return BTCVALUE.data * 100000000;
    } catch (error) {
      console.log(error);
      throw new Error('An error occurred while converting payment to sats');
    }
  }

  async getUsdValue(sats: string) {
    try {
      const BTCVALUE = await axios({
        method: 'GET',
        url: `https://blockchain.info/tobtc?currency=USD&value=1`,
      });

      return 1 / (BTCVALUE.data / parseFloat(sats)) / 100000000;
    } catch (error) {
      throw new Error('An error occurred while converting payment to usd');
    }
  }
}
