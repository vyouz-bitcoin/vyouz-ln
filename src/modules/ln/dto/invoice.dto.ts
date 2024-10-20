export class InvoiceDto {
  amount: number;
  sats: number;
  currency: string;
  socketClient: string;
}

export class TelegramInvoiceDto {
  amount: string;
  sats: string;
  currency: string;
  address: string;
}
