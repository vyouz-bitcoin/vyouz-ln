import { Injectable } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { GoService } from '../integrations/go/go.service';
import { UserRepository } from './user.repository';

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
      accountType: authUserDetails.type,
    });

    return this.usersRepository.save(createdUser);
  }
}
