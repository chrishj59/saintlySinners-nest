import { IsNumber, IsOptional, IsString } from '@nestjs/class-validator';

export class DeliveryChargeDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsNumber()
  vendorId: number;

  @IsString()
  courierId: string;

  @IsNumber()
  countryId: number;

  @IsString()
  uom: string;

  @IsNumber()
  minWeight: number;

  @IsNumber()
  maxWeight: number;

  @IsNumber()
  amount: number;
}
