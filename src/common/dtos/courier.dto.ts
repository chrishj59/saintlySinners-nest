import { IsString, IsUUID } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class CourierDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  shippingModule: string;

  @IsOptional()
  @IsString()
  cutOffTime: string;
}
