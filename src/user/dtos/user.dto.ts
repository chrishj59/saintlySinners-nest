import { IsString } from 'class-validator';

export class FusionAuthUserDto {
  @IsString()
  email: string;
}
