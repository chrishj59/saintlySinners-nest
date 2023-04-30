import { Controller, Get } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
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

  @Get('/fuseAuthUser')
  public async getUser(): // @Query() dto: BrandIdDto,
  Promise<any> {
    //Promise<EDC_PRODUCT[] | ResponseMessageDto>
    return { user: { email: 'fusionTest@btinternet.com' } };
  }
}
