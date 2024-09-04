import { IsNumber, IsString } from '@nestjs/class-validator';

export class UserIdParam {
  @IsString()
  userId: string;
}
