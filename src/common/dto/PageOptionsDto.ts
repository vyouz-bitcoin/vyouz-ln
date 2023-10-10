import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Allow,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

// import { AbstractEntity } from '../abstract.entity';
import { Period } from '../constant/period';
import { Order } from '../constant/order';
export class PageOptionsDto {
  @ApiPropertyOptional({
    enum: Order,
    default: Order.ASC,
  })
  @IsEnum(Order, { message: 'Order can only be ASC or DESC' })
  @IsOptional()
  readonly order: Order = Order.ASC;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Page cannot be less than 1' })
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Take cannot be less than 1' })
  @Max(50, { message: 'Take cannot be more than 50' })
  @IsOptional()
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }

  @ApiPropertyOptional()
  @IsString()
  @Allow()
  q = '';

  @Allow()
  @ApiPropertyOptional()
  readonly endDate: string;

  @Allow()
  @ApiPropertyOptional()
  readonly startDate: string;

  @Allow()
  @ApiPropertyOptional()
  readonly forDate: string;

  @ApiPropertyOptional({
    enum: Period,
    default: Period.ALL_TIME,
  })
  @Allow()
  @IsEnum(Period, {
    message: "Period can only be ['day' | 'range' | 'allTime']",
  })
  @IsOptional()
  @ApiPropertyOptional()
  readonly period = Period.ALL_TIME;

  id: string;
  createdAt: Date;
  updatedAt: Date;
  metaData: Record<string, any>;
}
