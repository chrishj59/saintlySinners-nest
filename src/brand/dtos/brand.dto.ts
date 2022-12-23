import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}
