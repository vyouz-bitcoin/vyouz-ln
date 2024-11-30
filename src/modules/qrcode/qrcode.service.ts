import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QRCodeService {
  // Generate QR Code as a Data URL
  async generateQRCodeDataURL(text: string): Promise<string> {
    try {
      return await QRCode.toDataURL(text);
    } catch (error) {
      throw new Error(`Failed to generate QR Code: ${error.message}`);
    }
  }

  // Generate QR Code as a file
  async generateQRCodeFile(text: string, filePath: string): Promise<void> {
    try {
      await QRCode.toFile(filePath, text);
    } catch (error) {
      throw new Error(`Failed to generate QR Code file: ${error.message}`);
    }
  }

  // Generate QR Code as ASCII string (for terminal display)
  async generateQRCodeString(text: string): Promise<string> {
    try {
      return await QRCode.toString(text, { type: 'terminal' });
    } catch (error) {
      throw new Error(`Failed to generate QR Code string: ${error.message}`);
    }
  }
}
