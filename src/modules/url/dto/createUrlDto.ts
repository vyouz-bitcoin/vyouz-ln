import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class CreateUrlDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'url is required' })
  @Matches(/^https:\/\/[a-zA-Z0-9_-]+(\.[a-zA-Z]{2,6})$/, {
    message:
      'Invalid URL format. It must start with https:// and have a valid domain.',
  })
  url: string;
}
