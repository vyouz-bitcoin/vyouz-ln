import { Injectable } from '@nestjs/common';
import { UrlRepository } from './url.repository';
import { nanoid } from 'nanoid';

@Injectable()
export class UrlService {
  constructor(public readonly urlRepository: UrlRepository) {}
  // https://www.target.com
  async createShortenedUrl(originalUrl: string): Promise<string> {
    const shortenedUrl = nanoid(5); // You can adjust the length of the shortened URL
    const url = this.urlRepository.create({ originalUrl, shortenedUrl });
    await this.urlRepository.save(url);
    return shortenedUrl;
  }

  async trackClick(shortenedUrl: string) {
    // Find the original URL based on the provided shortened URL
    const url = await this.urlRepository.findOne({ where: { shortenedUrl } });

    if (url) {
      // Increase the click count for analytics purposes
      url.click += 1;
      await this.urlRepository.save(url);

      // Return the original URL associated with the shortened URL
      return url;
    }

    // Return null if the shortened URL is not found
    return null;
  }
}
