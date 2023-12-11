import { IsNumber, IsString } from '@nestjs/class-validator';

export class CountryUpdateDTO {
  @IsNumber()
  id: number;

  @IsNumber()
  edcCountryCode: number;
}
