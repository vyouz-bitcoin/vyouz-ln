import { ApiProperty } from '@nestjs/swagger';

import { UrlEntity } from '../url.entity';
import { AbstractDto } from './../../../common/dto/AbstractDto';

export class UrlDto extends AbstractDto {
  @ApiProperty()
  originalUrl: string;

  @ApiProperty()
  shortenedUrl: string;

  @ApiProperty()
  click: number;

  @ApiProperty()
  userId: string;
  constructor(url: UrlEntity) {
    super(url);
    this.originalUrl = url.originalUrl;
    this.shortenedUrl = url.shortenedUrl;
    this.click = url.click;
    this.userId = url.userId;
  }
}
