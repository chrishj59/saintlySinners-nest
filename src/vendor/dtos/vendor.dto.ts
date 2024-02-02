import { IsBoolean, IsNumber, IsString } from '@nestjs/class-validator';
import { IsOptional } from 'class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;
}
