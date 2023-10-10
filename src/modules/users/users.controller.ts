import { Body, Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { UserEntity } from './user.entity';
import { UsersService } from './users.service';
import { Request } from 'express';
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

  @Get('one')
  @ApiOperation({ description: 'Get a single ' })
  @ApiResponse({ status: 201, description: 'User gotten' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getASingleUser(@Req() request: Request) {
    return this.usersService.checkUserExist(request.headers.authorization);
  }
}

//country
//email
//firstname
//lastname
//type : individual / organization
