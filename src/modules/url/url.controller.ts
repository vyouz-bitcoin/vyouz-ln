import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Param,
  Res,
  Body,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CreateUrlDto } from './dto/createUrlDto';

@Controller('l')
@ApiTags('l')
export class UrlController {
  constructor(
    private usersService: UrlService,
    private urlService: UrlService,
  ) {}

  @Get(':shortenedUrl')
  async redirectToOriginalUrl(
    @Param('shortenedUrl') shortenedUrl: string,
    @Res() res: Response,
  ): Promise<void> {
    const originalUrl = await this.urlService.trackClick(shortenedUrl);

    if (originalUrl) {
      res
        // .status(HttpStatus.MOVED_PERMANENTLY)
        .redirect(originalUrl.originalUrl);
      return;
    }

    res.status(HttpStatus.NOT_FOUND).send('URL not found');
  }

  @Post('create-short-url')
  async createShortUrl(@Body() dto: CreateUrlDto): Promise<string> {
    const shortenedUrl = await this.urlService.createShortenedUrl(dto.url);
    return shortenedUrl;
  }
}
