import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';

import { UserService } from './user.service';
import { UserLikeItemDto } from './dtos/user-like.dto';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import FindOneStringParams, {
  FindOneNumberParams,
} from 'src/utils/findOneParamString';
import { UserDetailsDto } from './dtos/user-details.dto';
import { UserIdParam } from './interface/userIdParam';

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

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
}
