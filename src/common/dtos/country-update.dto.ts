import {
  IsNumber,
  IsString,
  IsOptional,
  IsBoolean,
} from '@nestjs/class-validator';

export class CountryUpdateDTO {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  edcCountryCode: number;

  @IsOptional()
  @IsBoolean()
  deliveryActive: boolean;
}
