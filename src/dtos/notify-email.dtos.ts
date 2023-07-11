import { IsEmail, IsString } from '@nestjs/class-validator';

export class NotifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  text: string;
}
