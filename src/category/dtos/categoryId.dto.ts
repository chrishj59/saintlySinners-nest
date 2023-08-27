import { IsNumber } from '@nestjs/class-validator';

export class CategoryIdDto {
  @IsNumber()
  id: number;
}
