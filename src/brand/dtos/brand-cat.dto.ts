import { IsNumber, IsOptional, IsString } from 'class-validator';

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
}
