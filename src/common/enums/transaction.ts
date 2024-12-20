export enum TransactionAction {
  FUND_BITCOIN = 'fund_bitcoin',
  FUND_USD = 'fund_usd',
  CREDIT_WALLET_FOR_PAYOUT = 'credlt wallet payout',
}

export enum TransactionType {
  CREDIT = 'credit',
  DEBIT = 'debit',
  DECLINED = 'authorization_declined',
}

export enum TransactionStatus {
  INITIATED = 'initiated',
  PROCESSING = 'processing',
  CANCELED = 'canceled',
  SUCCESS = 'success',
  PENDING = 'pending',
  FLAGGED = 'flagged',
  FAILED = 'failed',
  PROCESSING_P = 'processing_p',
}
