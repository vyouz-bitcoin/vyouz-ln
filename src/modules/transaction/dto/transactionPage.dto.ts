import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDto } from '../../../common/dto/PageMetaDto';
import { TransactionEntity } from '../transaction.entity';
import { TransactionDto } from './transaction.dto';

export class TransactionPageDto {
  @ApiProperty({
    type: TransactionDto,
    isArray: true,
  })
  readonly transactions: TransactionEntity[];

  @ApiProperty()
  readonly meta: PageMetaDto;

  constructor(transactions: TransactionEntity[], meta: PageMetaDto) {
    this.transactions = transactions;
    this.meta = meta;
  }
}
