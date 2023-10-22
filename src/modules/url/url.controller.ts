import {
  Controller,
  Get,
  Post,
  HttpStatus,
  Param,
  Res,
  Body,
  Req,
} from '@nestjs/common';
import { UrlService } from './url.service';
import { Response, Request } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { CreateUrlDto } from './dto/createUrlDto';
import { UsersService } from '../users/users.service';

@Controller('l')
@ApiTags('l')
export class UrlController {
  constructor(
    private usersService: UsersService,
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
  async createShortUrl(
    @Req() req: Request,
    @Body() dto: CreateUrlDto,
  ): Promise<string> {
    const user = await this.usersService.checkUserExist(
      req.headers.authorization,
    );
    const shortenedUrl = await this.urlService.createShortenedUrl(
      user.id,
      dto.url,
    );
    return shortenedUrl;
  }
}
