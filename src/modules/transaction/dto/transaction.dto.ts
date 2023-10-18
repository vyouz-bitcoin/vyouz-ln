import { ApiProperty } from '@nestjs/swagger';
import { Allow } from 'class-validator';

import { AbstractDto } from './../../../common/dto/AbstractDto';
import {
  TransactionType,
  TransactionStatus,
  TransactionAction,
} from './../../../common/enums/transaction';
export class TransactionDto extends AbstractDto {
  @Allow()
  @ApiProperty()
  reference: string;

  @Allow()
  @ApiProperty()
  description: string;

  @Allow()
  @ApiProperty()
  balanceAfter: number;

  @Allow()
  @ApiProperty()
  balanceBefore: number;

  @Allow()
  @ApiProperty()
  amount: number;

  @Allow()
  @ApiProperty()
  centAmount: number;

  @Allow()
  @ApiProperty()
  fees: number;

  @Allow()
  @ApiProperty()
  centFees: number;

  @Allow()
  @ApiProperty()
  rate: number;

  @Allow()
  @ApiProperty()
  type: TransactionType;

  @Allow()
  @ApiProperty()
  status: TransactionStatus;

  @Allow()
  @ApiProperty()
  action: TransactionAction;

  @Allow()
  @ApiProperty()
  invoiceId: string;

  @Allow()
  @ApiProperty()
  callbackUrl: string;

  @Allow()
  @ApiProperty()
  walletId: string;

  @Allow()
  @ApiProperty()
  userId: string;
}
