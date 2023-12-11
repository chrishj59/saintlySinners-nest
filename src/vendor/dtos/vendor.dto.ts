import { IsString } from '@nestjs/class-validator';

export class CreateVendorDto {
  @IsString()
  name: string;
}
