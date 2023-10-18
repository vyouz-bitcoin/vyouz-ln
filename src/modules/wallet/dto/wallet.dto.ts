import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { Currency } from './../../../common/enums/currency';

export class WalletDto extends AbstractDto {
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'name  is required' })
  name: string;

  @IsBoolean()
  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'active  is required' })
  active: boolean;

  @ApiProperty({ required: true })
  @IsNotEmpty({ message: 'currency is required' })
  currency: Currency;

  @ApiProperty({ required: true })
  description: string;

  @ApiProperty({ required: true })
  balance: string;
}
