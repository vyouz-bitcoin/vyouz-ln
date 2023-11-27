import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Allow, IsEnum, IsNotEmpty, Matches } from 'class-validator';
import { CampaignType } from '../../../common/enums/campaignType';

export class CreateCampaignDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'title is required' })
  title: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'amount is required' })
  amount: number;

  // @ApiProperty()
  // // @IsNotEmpty({ message: 'amount is required' })
  // satAmount: number;

  @ApiProperty({ enum: CampaignType })
  @IsEnum(CampaignType, { message: 'type entered is not valid' })
  @IsNotEmpty({ message: 'type is required' })
  type: CampaignType;

  @ApiProperty()
  @IsNotEmpty({ message: 'content is required' })
  content: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'startDate is required' })
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'endDate is required' })
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty({ message: 'Device is required' })
  targetCountry: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Device is required' })
  targetAge: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'Device is required' })
  targetGender: string;

  @ApiPropertyOptional()
  @Matches(/^https:\/\/[a-zA-Z0-9_-]+(\.[a-zA-Z]{2,6})$/, {
    message:
      'Invalid URL format. It must start with https:// and have a valid domain.',
  })
  // @IsNotEmpty({ message: 'Website is required' })
  website: string;
  // @ApiPropertyOptional()
  userId: string;
}
