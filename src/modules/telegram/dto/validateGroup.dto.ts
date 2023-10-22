import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Matches } from 'class-validator';

export class ValidateGroupDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'url is required' })
  @Matches(/^@[A-Za-z0-9_]+$/, {
    message:
      'Invalid Telegram channel format. It must start with @ and can include letters, numbers, and underscores.',
  })
  telegramChannel: string;
}
