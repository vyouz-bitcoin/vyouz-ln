import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthUserInterceptor } from '../../interceptors/auth-user-interceptors';
import { AuthUser } from '../../decorators/auth-user.decorator';

@Controller('users')
@ApiTags('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  @UseInterceptors(AuthUserInterceptor)
  @ApiOperation({ description: 'Get all users' })
  @ApiResponse({ status: 201, description: 'User gotten' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAllUsers(@AuthUser() user): Promise<Array<User>> {
    console.log(
      '🚀 ~ file: users.controller.ts:26 ~ UsersController ~ getAllUsers ~ user:',
      user,
    );
    return this.usersService.getAllUsers();
  }
}

//country
//email
//firstname
//lastname
//type : individual / organization
