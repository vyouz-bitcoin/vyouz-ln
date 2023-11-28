import {
  Controller,
  Get,
  Query,
  Headers,
  Req,
  Post,
  Body,
  Res,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { Request, Response } from 'express';
import { CampaignService } from './campaign.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PageOptionsDto } from '../../common/dto/PageOptionsDto';
import { CreateCampaignDto } from './dto/CreateCampaign.dto';

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

  @Post('create-campaign')
  async createCampaign(
    @Req() req: Request,
    @Res() res: Response,
    @Body() dto: CreateCampaignDto,
  ) {
    console.log(
      '🚀 ~ file: campaign.controller.ts:54 ~ CampaignController ~ dto:',
      dto,
    );
    const user = await this.usersService.checkUserExist(
      req.headers.authorization,
    );
    console.log(
      '🚀 ~ file: campaign.controller.ts:57 ~ CampaignController ~ user:',
      user,
    );
    const campaign = await this.campaignService.create(user.id, dto);
    console.log(
      '🚀 ~ file: campaign.controller.ts:59 ~ CampaignController ~ campaign:',
      campaign,
    );
    res.status(200).json(campaign);
  }
}

//country
//email
//firstname
//lastname
//type : individual / organization
