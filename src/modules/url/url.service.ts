import { Injectable } from '@nestjs/common';
import { UrlRepository } from './url.repository';
import { nanoid } from 'nanoid';
import { UsersService } from '../users/users.service';
import { UrlEntity } from './url.entity';

@Injectable()
export class UrlService {
  constructor(
    public readonly urlRepository: UrlRepository,
    public readonly userService: UsersService,
  ) {}
  // https://www.target.com

  async createShortenedUrl(
    userId: string,
    originalUrl: string,
  ): Promise<string> {
    const user = await this.userService.getById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const shortenedUrl = `${process.env.SITEREDIRECTURL}/${nanoid(5)}`;

    const url = this.urlRepository.create({
      originalUrl,
      shortenedUrl,
      user,
      userId,
    });
    await this.urlRepository.save(url);

    return shortenedUrl;
  }

  async trackClick(shortenedUrl: string) {
    // Find the original URL based on the provided shortened URL
    const short = `${process.env.SITEREDIRECTURL}/${shortenedUrl}`;
    const url = await this.urlRepository.findOne({
      where: { shortenedUrl: short },
    });

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

  async checkUrlExistsForBlogger(
    userId: string,
    originalUrl: string,
  ): Promise<UrlEntity | null> {
    const url = await this.urlRepository
      .createQueryBuilder('url')
      .innerJoin('url.user', 'user')
      .where('user.id = :userId', { userId })
      .andWhere('url.originalUrl = :originalUrl', { originalUrl })
      .getOne();

    return url || null;
  }

  async calculateClicksSoFarAndPayout({ userId }): Promise<void> {
    // Get all active URLs for the given user
    const activeUrls = await this.urlRepository.find({
      where: { user: userId, active: true },
      relations: ['user'],
    });

    let totalNotPaidOutClicks = 0;

    // Calculate the clicks not paid out yet for each URL
    for (const url of activeUrls) {
      const clicksNotPaidOutYet = url.click - url.clicksPaidOut;
      totalNotPaidOutClicks += clicksNotPaidOutYet;

      // Update the clicksPaidOut field for each URL
      url.clicksPaidOut += clicksNotPaidOutYet;
      await this.urlRepository.save(url);
    }

    // Payout the user
    if (totalNotPaidOutClicks > 0) {
      await this.userService.payout(userId, totalNotPaidOutClicks);
    }
  }
}
