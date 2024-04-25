import { IsArray, IsNumber } from '@nestjs/class-validator';

export class ProductRestrictedDto {
  @IsNumber({}, { each: true })
  productIds: number[];
}
