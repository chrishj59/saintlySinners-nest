import {
  IsNumber,
  IsOptional,
  IsBoolean,
  IsString,
} from '@nestjs/class-validator';

export class BrandCatDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  category: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsNumber()
  catLevel: number;

  @IsOptional()
  @IsBoolean()
  onHomePage: boolean;
}
