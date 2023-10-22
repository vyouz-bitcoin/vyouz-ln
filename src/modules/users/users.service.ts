import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { GoService } from '../integrations/go/go.service';
import { UserRepository } from './user.repository';
import { accountType } from './../../common/enums/user';

@Injectable()
export class UsersService {
  constructor(
    public readonly usersRepository: UserRepository,
    public readonly goService: GoService,
  ) {}

  getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({});
  }

  async getById(id: string): Promise<UserEntity> {
    let user = {} as UserEntity;
    if (!id) return user;
    user = await this.usersRepository.findOneBy({ id });
    return user;
  }

  async checkUserExist(jwt: string): Promise<UserEntity> {
    // if we don't have user create and return
    // if we do just return
    const authUserDetails = await this.goService.getAuthDetails(jwt);
    const email = authUserDetails.email;
    const type =
      authUserDetails.type === 'wow'
        ? accountType.ADVERTISER
        : accountType.BLOGGER;

    const queryBuilder = this.usersRepository.createQueryBuilder('users');
    queryBuilder.where('users.email = :email', { email });

    const itemCount = await queryBuilder.getCount();
    const { entities } = await queryBuilder.getRawAndEntities();
    // const user = await this.usersRepository.findOne({
    //   email: authUserDetails.email,
    // });

    if (entities) {
      return entities[0];
    }

    const createdUser = await this.usersRepository.create({
      email: authUserDetails.email,
      firstName: authUserDetails.firstName,
      lastName: authUserDetails.lastName,
      country: authUserDetails.country,
      accountType: type,
    });

    return this.usersRepository.save(createdUser);
  }

  // Inside your service or repository class
  async getBloggerUsersWithTelegramLink(): Promise<UserEntity[]> {
    try {
      const bloggerUsers = await this.usersRepository
        .createQueryBuilder('user')
        .where('user.accountType = :accountType', {
          accountType: accountType.BLOGGER,
        })
        .andWhere('user.telegramLink IS NOT NULL')
        .getMany();

      return bloggerUsers;
    } catch (error) {
      // Handle the error, e.g., log it or throw a custom exception
      throw error;
    }
  }
}
