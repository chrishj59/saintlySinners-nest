import { IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class CategoryDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  title: string;
}
