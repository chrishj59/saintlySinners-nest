import {
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
}

export class DeliveryRemoteLocationUpdateDto {
  @IsNumber()
  id: number;

  @IsString()
  postCodePart: string;

  @IsNumber()
  remoteCharge: number;

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
