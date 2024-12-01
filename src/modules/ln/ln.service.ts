import { Injectable } from '@nestjs/common';
import { InvoiceDto, TelegramInvoiceDto } from './dto/invoice.dto';
import { AmountDto } from './dto/amount.dto';
import { LightningAddress, Invoice } from '@getalby/lightning-tools';
import { InvoiceGateway } from './ln.gateway';
import { ClientManagerService } from './client-manager.service';
import { fiat } from '@getalby/lightning-tools';
import { requestInvoice } from 'lnurl-pay';
import { Satoshis } from 'lnurl-pay/dist/types/types';

// eslint-disable-next-line @typescript-eslint/no-var-requires
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

  async generateLNInvoice(telegramInvoice: TelegramInvoiceDto) {
    try {
      const {
        invoice,
        params: { image },
        validatePreimage,
      } = await requestInvoice({
        lnUrlOrAddress: telegramInvoice.address,
        tokens: parseFloat(telegramInvoice.amount) as Satoshis,
      });

      return { invoice, image, validatePreimage };
    } catch (error) {}
  }

  async subscribeInvoice(invoice: Invoice) {
    try {
      return await invoice.isPaid();
    } catch (error) {
      throw new Error('Error occured while verifying payment');
    }
  }

  async subscribeLnInvoice(
    image: string,
    validatePreimage: (preimage: string) => boolean,
  ) {
    try {
      const paid = await validatePreimage(
        'd80ccd7e581d167b0cc4ea3c7f63c241ca39f7bf26decfe965417f48f54dd33b',
      );
      console.log(paid);
      return paid;
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
