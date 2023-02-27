import { IsString } from '@nestjs/class-validator';

export class CreateUserDto {
  @IsString()
  email: string;

  @IsString()
  name: string;

  @IsString()
  stripeCustomerId: string;
}
