import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';

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
  shippingModule: string;

  @IsString()
  uom: string;

  @IsNumber()
  minWeight: number;

  @IsNumber()
  maxWeight: number;

  @IsNumber()
  minDays: number;

  @IsNumber()
  maxDays: number;

  @IsString()
  durationDescription: string;

  @IsBoolean()
  hasTracking: boolean;

  @IsBoolean()
  hasLostClaim: boolean;

  @IsNumber()
  amount: number;
}
