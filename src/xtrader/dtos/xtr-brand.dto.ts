import { IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

import { IsBoolean } from 'class-validator';

export class XtrBrandDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageName: string;

  @IsOptional()
  imageKey: string;

  @IsBoolean()
  isFavourite: boolean;

  @IsNumber()
  ranking: number;
}
