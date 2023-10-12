import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class CategoryDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsBoolean()
  onMenu: boolean;

  @IsOptional()
  @IsNumber()
  menulevel: number;

  @IsOptional()
  @Type(() => CategoryDto)
  childCategories: CategoryDto[];

  @IsOptional()
  @Type(() => CategoryDto)
  parentCategory: CategoryDto;
}
