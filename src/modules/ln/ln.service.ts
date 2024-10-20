import { Injectable } from '@nestjs/common';
import { InvoiceDto, TelegramInvoiceDto } from './dto/invoice.dto';
import { AmountDto } from './dto/amount.dto';
import { LightningAddress, Invoice } from '@getalby/lightning-tools';
import { InvoiceGateway } from './ln.gateway';
import { ClientManagerService } from './client-manager.service';
import { fiat } from '@getalby/lightning-tools';

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
      const BTCVALUE = await fiat.getSatoshiValue({
        amount: invoiceDto.amount,
        currency: invoiceDto.currency,
      });

      const SATS = BTCVALUE;
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
      const value = await fiat.getSatoshiValue({
        currency: amountDto.currency,
        amount: amountDto.amount,
      });
      return value;
      return value;
    } catch {
      throw new Error('An error occurred while converting payment to sats');
    }
  }

  async getUsdValue(sats: string) {
    try {
      const value = await fiat.getFiatValue({ satoshi: sats, currency: 'USD' });
      return value;
    } catch (error) {
      throw new Error('An error occurred while converting payment to usd');
    }
  }
}
