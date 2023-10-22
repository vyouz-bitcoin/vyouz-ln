import { Controller, Get, Query, Headers, Req } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { CampaignService } from './campaign.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/PageOptionsDto';

@Controller('campaigns')
@ApiTags('campaign')
export class CampaignController {
  constructor(
    private usersService: UsersService,
    private campaignService: CampaignService,
  ) {}

  @Get()
  @ApiOperation({ description: 'Get all campaigns' })
  @ApiResponse({ status: 201, description: 'Campaign gotten' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getAllCampaigns(
    @Headers('authorization') jwtToken: string,
    @Query() pageOptionsDto: PageOptionsDto,
  ) {
    const user = await this.usersService.checkUserExist(jwtToken);
    return this.campaignService.getCampaigns(user.id, pageOptionsDto);
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
