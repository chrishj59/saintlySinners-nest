import { IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class XtrCategoryDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  parentId: number;

  @IsOptional()
  @IsString()
  category_image: string;

  // @IsOptional()
  // @IsString()
  // imageKey?: string;

  // @IsOptional()
  // @IsString()
  // imageType?: string;
}
