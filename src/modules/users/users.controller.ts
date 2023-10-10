import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('users')
@ApiTags('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @ApiOperation({ description: 'Get all users' })
  @ApiResponse({ status: 201, description: 'User gotten' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAllUsers(): Promise<Array<UserEntity>> {
    return this.usersService.getAllUsers();
  }
}

//country
//email
//firstname
//lastname
//type : individual / organization
