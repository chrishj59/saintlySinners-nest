import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';

export class XtrReviewDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsNumber()
  productId: number;

  @IsString()
  userId: string;

  @IsNumber()
  rating: number;

  @IsString()
  title: string;

  @IsString()
  reviewBody: string;
}
