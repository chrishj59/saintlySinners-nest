import { IsNumber } from 'class-validator';

export class BrandIdDto {
  @IsNumber()
  id: number;
}
