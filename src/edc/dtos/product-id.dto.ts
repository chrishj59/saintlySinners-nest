import { IsOptional, IsString } from '@nestjs/class-validator';

export class ProductIdDto {
  @IsString()
  @IsOptional()
  id: number;
}
