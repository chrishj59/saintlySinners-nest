import { IsString } from '@nestjs/class-validator';

export class DeliveryChargeDeleteDto {
  @IsString()
  id: string;
}
