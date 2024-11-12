import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

export class UserLikeItemDto {
  // @IsOptional()
  @IsNumber()
  productId: number;

  @IsOptional()
  @IsString()
  userId: string;

  @IsBoolean()
  liked: boolean;
}
