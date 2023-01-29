import { IsString } from '@nestjs/class-validator';

export class CourierDto {
  @IsString()
  name: string;
}
