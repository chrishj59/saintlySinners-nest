import { IsUUID } from '@nestjs/class-validator';
import { IsNumber } from 'class-validator';

export class BrandIdDto {
  @IsNumber()
  id: number;
}

export class XtrBrandIdDto {
  @IsUUID()
  id: string;
}
