import { boolean } from 'joi';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';

export class DeliveryRemoteLocationDto {
  @IsUUID()
  deliveryId: string;

  @IsString()
  postCodePart: string;

  @IsNumber()
  remoteCharge: number;

  @IsOptional()
  @IsNumber()
  days: number;

  @IsOptional()
  @IsBoolean()
  surcharge: boolean;
}

export class DeliveryRemoteLocationUpdateDto {
  @IsNumber()
  id: number;

  @IsString()
  postCodePart: string;

  @IsNumber()
  remoteCharge: number;

  @IsOptional()
  @IsBoolean()
  surcharge: boolean;

  @IsOptional()
  @IsNumber()
  days: number;
}

export class DeliveryRemoteLocationDeleteDto {
  @IsString()
  postCodePart: string;

  @IsUUID()
  deliveryId: string;
}
