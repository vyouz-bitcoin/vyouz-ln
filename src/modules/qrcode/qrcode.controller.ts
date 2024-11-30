import { Controller, Get, Query, Res } from '@nestjs/common';
import { QRCodeService } from './qrcode.service';
import { Response } from 'express';

@Controller('qr-code')
export class QRCodeController {
  constructor(private readonly qrCodeService: QRCodeService) {}

  // Endpoint to generate QR Code Data URL
  @Get('data-url')
  async generateQRCodeDataURL(
    @Query('text') text: string,
  ): Promise<{ dataURL: string }> {
    const dataURL = await this.qrCodeService.generateQRCodeDataURL(text);
    return { dataURL };
  }

  // Endpoint to generate and return QR Code as an image file
  @Get('image')
  async generateQRCodeImage(@Query('text') text: string, @Res() res: Response) {
    const filePath = 'qrcode.png';
    await this.qrCodeService.generateQRCodeFile(text, filePath);
    res.sendFile(filePath, { root: '.' });
  }

  // Endpoint to generate QR Code ASCII string for terminal display
  @Get('ascii')
  async generateQRCodeString(@Query('text') text: string): Promise<string> {
    return await this.qrCodeService.generateQRCodeString(text);
  }
}
