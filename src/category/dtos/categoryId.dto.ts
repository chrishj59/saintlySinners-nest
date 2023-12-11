import { IsNumber, IsOptional } from '@nestjs/class-validator';

export class CategoryIdDto {
  @IsNumber()
  id: number;
}
