import { ApiProperty } from '@nestjs/swagger';

import { AbstractDto } from '../../../common/dto/AbstractDto';
import { UserEntity } from '../user.entity';
import { accountType } from './../../../common/enums/user';

export class UserDto extends AbstractDto {
  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string; // will be enum

  @ApiProperty()
  country: string; // will be enum

  @ApiProperty()
  accountType: accountType; // will be enum

  constructor(user: UserEntity) {
    super(user);
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.email = user.email;
    this.accountType = user.accountType;
    this.country = user.country;
  }
}
