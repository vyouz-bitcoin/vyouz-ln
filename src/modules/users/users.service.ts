import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { GoService } from '../integrations/go/go.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
    public readonly goService: GoService,
  ) {}

  getAllUsers(): Promise<UserEntity[]> {
    return this.usersRepository.find({});
  }

  async checkUserExist(jwt: string) {
    // if we don't have user create and return
    // if we do just return
    const authUserDetails = await this.goService.getAuthDetails(jwt);

    const user = await this.usersRepository.findOne({
      email: authUserDetails.email,
    });

    if (user) {
      return user;
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
