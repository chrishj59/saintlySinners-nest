import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { UserService } from './user.service';
import { UserLikeItemDto } from './dtos/user-like.dto';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import FindOneStringParams, {
  FindOneNumberParams,
} from 'src/utils/findOneParamString';
import { UserDetailsDto } from './dtos/user-details.dto';
import { UserIdParam } from './interface/userIdParam';
import { USER_ADDRESS } from './entity/userAddress.entity';
import { UserAddressDto } from './dtos/userAddress.dto';
import { AUTHJS_USER } from './entity/authJsUser.entity';
import { XTR_PRODUCT_REVIEW } from 'src/xtrader/entity/xtr-product-review.entity';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  logger = new Logger('UserController');
  // @Post('avatar')
  // @UseInterceptors(FileInterceptor('file'))
  // async addAvatar(
  //   @Req() request: any,
  //   @UploadedFiles() file: Express.Multer.File,
  // ) {
  //   return this.userService.addAvatar(
  //     request.user.id,
  //     file.buffer,
  //     file.originalname,
  //   );
  // }

  @Get('/user')
  public async getAllUsers(): Promise<AUTHJS_USER[]> {
    return await this.userService.getAllUsers();
  }

  @Post('/likeItem')
  public async likeItem(
    @Body() dto: UserLikeItemDto,
  ): Promise<ResponseMessageDto> {
    return await this.userService.addLikeItem(dto);
  }

  @Get('/likeItem/:id')
  public async getUserLikedItems(@Param() userId: FindOneStringParams) {
    const id = userId.id;
    return await this.userService.getUserLikedItems(id);
  }

  @Patch('/userDetails/:id')
  public async updateUser(
    @Param() paramId: FindOneStringParams,
    @Body() userDetails: UserDetailsDto,
  ) {
    const userid = paramId.id;
    return await this.userService.updateUser(userid, userDetails);
  }

  @Get(`userDetails/:id`)
  public async getUser(@Param() paramId: FindOneStringParams) {
    const userid = paramId.id;
    return await this.userService.getUser(userid);
  }

  @Get('/userAddress/:id')
  public async getUserAddresses(
    @Param() paramId: FindOneStringParams,
  ): Promise<USER_ADDRESS[]> {
    const userId = paramId.id;
    return await this.userService.getUserAddress(userId);
  }

  @Post('/userAddress/:id')
  public async addUserAddress(
    @Param() userId: FindOneStringParams,
    @Body() address: UserAddressDto,
  ): Promise<USER_ADDRESS> {
    return await this.userService.addUserAddress(userId.id, address);
  }

  @Patch('/userAddress/:id')
  public async updateUserAddress(
    @Param() userId: FindOneStringParams,
    @Body() address: UserAddressDto,
  ): Promise<USER_ADDRESS> {
    return await this.userService.addUserAddress(userId.id, address);
  }
  @Get(`/userReviews/:id`)
  public async getUserReviews(
    @Param() userId: FindOneStringParams,
  ): Promise<XTR_PRODUCT_REVIEW[]> {
    return await this.userService.getUserReviews(userId.id);
  }

  @Get(`/userOverview/:id`)
  public async getUserLikesReviews(@Param() userId: FindOneStringParams) {
    return await this.userService.getUserOverview(userId.id);
  }

  @Get('/userOrders/:id')
  public async getUserOrders(
    @Param() userId: FindOneStringParams,
  ): Promise<AUTHJS_USER> {
    return await this.userService.getUserOrders(userId.id);
  }
}
