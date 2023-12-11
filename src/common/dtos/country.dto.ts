import { IsOptional, IsString } from '@nestjs/class-validator';
import { IsNumber } from 'class-validator';

export class CountryDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  langCode: string;

  @IsOptional()
  @IsString()
  langName: string;

  @IsString()
  iso3: string;

  @IsString()
  iso2: string;

  @IsString()
  numericCode: string;

  @IsString()
  phoneCode: string;

  @IsString()
  capital: string;

  @IsString()
  currency: string;

  @IsString()
  currencySymbol: string;

  @IsString()
  tld: string;

  @IsString()
  region: string;

  @IsString()
  subRegion: string;

  @IsString()
  timezones: string;

  @IsString()
  native: string;

  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;

  @IsString()
  emoji: string;

  @IsString()
  emojiu: string;

  @IsOptional()
  @IsNumber()
  edcCountryCode: number;
}
