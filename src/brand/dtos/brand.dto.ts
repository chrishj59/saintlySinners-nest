import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

export class BrandDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsNumber()
  catid: number;

  @IsOptional()
  @IsString()
  categoryType: string;

  @IsOptional()
  @IsString()
  catDescription: string;

  @IsOptional()
  @IsNumber()
  catLevel: number;

  @IsOptional()
  @IsString()
  awsKey: string;

  @IsOptional()
  @IsString()
  awsImageFormat: string;

  @IsOptional()
  @IsBoolean()
  onHomePage: boolean;
}
