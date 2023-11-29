import { Injectable } from '@nestjs/common';
import { InvoiceDto, TelegramInvoiceDto } from './dto/invoice.dto';
import axios from 'axios';

import { AmountDto } from './dto/amount.dto';
import { LightningAddress, Invoice } from '@getalby/lightning-tools';
import { InvoiceGateway } from './ln.gateway';
import { ClientManagerService } from './client-manager.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const CC = require('currency-converter-lt');
@Injectable()
export class LnService {
  constructor(
    private readonly invoiceGateway: InvoiceGateway,
    private readonly clientManager: ClientManagerService,
  ) {}

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
      const ln = new LightningAddress(process.env.LN_ADDRESS);
      await ln.fetch();
      // get the LNURL-pay data:
      const invoice: Invoice = await ln.requestInvoice({
        satoshi: SATS,
        comment: 'wallet funding with lightning',
      });

      this.listenInvoice(invoice, invoiceDto.socketClient);
      return { paymentRequest: invoice.paymentRequest };
    } catch {
      throw new Error('An error occurred while generating the invoice');
    }
  }

  async listenInvoice(invoice: Invoice, clientId: string) {
    try {
      const intervalId = setInterval(async () => {
        const paid = await invoice.isPaid();
        if (paid) {
          const client = this.clientManager.getClient(clientId);
          this.invoiceGateway.handlePaymentVerified(client, {
            message: 'Payment verified',
          });
          clearInterval(intervalId);
        }
      }, 3000);
    } catch (error) {
      throw new Error('Error occured while verifying payment');
    }
  }

  async generateTelegramInvoice(telegramInvoice: TelegramInvoiceDto) {
    try {
      //convert the currency passed to USD
      const ln = new LightningAddress(telegramInvoice.address);
      await ln.fetch();
      // get the LNURL-pay data:
      const invoice: Invoice = await ln.requestInvoice({
        satoshi: parseFloat(telegramInvoice.sats),
        comment: 'payment for picture in vyouz',
      });
      return invoice;
    } catch (error) {
      throw new Error('An error occurred while generating the invoice');
    }
  }

  async subscribeInvoice(invoice: Invoice) {
    try {
      return await invoice.isPaid();
    } catch (error) {
      throw new Error('Error occured while verifying payment');
    }
  }

  async getSatsValue(amountDto: AmountDto) {
    try {
      const currencyConverter = new CC();
      const localAmount = await currencyConverter
        .from(amountDto.currency)
        .to('USD')
        .amount(parseFloat(amountDto.amount))
        .convert();

      const BTCVALUE = await axios({
        method: 'GET',
        url: `https://blockchain.info/tobtc?currency=USD&value=${localAmount}`,
      });

      return BTCVALUE.data * 100000000;
    } catch {
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
