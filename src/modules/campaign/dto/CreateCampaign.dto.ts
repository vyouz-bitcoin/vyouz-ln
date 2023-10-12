import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CampaignType } from '../../../common/enums/campaignType';

export class CreateCampaignDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'amount is required' })
  amount: number;

  @ApiProperty()
  // @IsNotEmpty({ message: 'amount is required' })
  satAmount: number;

  @ApiProperty({ enum: CampaignType })
  @IsEnum(CampaignType, { message: 'type entered is not valid' })
  @IsNotEmpty({ message: 'type is required' })
  type: CampaignType;

  @ApiProperty()
  @IsNotEmpty({ message: 'content is required' })
  content: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'start date is required' })
  startDate: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Device is required' })
  endDate: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Device is required' })
  targetCountry: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Device is required' })
  targetAge: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Device is required' })
  targetGender: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'userId is required' })
  userId: string;
}
