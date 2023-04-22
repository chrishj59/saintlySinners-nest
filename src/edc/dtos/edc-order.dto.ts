import { ArrayNotEmpty, IsArray, IsOptional } from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { EdcCountryEnum } from 'src/enums/edc-country-enum';
import { EdcCustomerCurrencyEnum } from 'src/enums/edc-shipping-currency';

export class Products {
  @IsArray()
  @ArrayNotEmpty()
  @IsString()
  artnr: string[];
}

export class EdcOrderDto {
  @IsString()
  name: string;

  @IsString()
  street: string;

  @IsOptional()
  @IsNumber()
  house_nr: number;

  @IsOptional()
  @IsString()
  house_nr_ext: string;

  @IsString()
  postalcode: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  state: string;

  @IsOptional()
  @IsString()
  county?: string;

  @IsEnum(EdcCountryEnum)
  country: EdcCountryEnum;

  // Fields for outside EU shipping
  @IsOptional()
  @IsString()
  consumer_amount: string;

  @IsOptional()
  @IsEnum(EdcCustomerCurrencyEnum)
  consumer_amount_currency?: EdcCustomerCurrencyEnum;

  //reference to PDF
  @IsOptional()
  @IsString()
  attachment: string;
  // Customer email when shipped

  @IsOptional()
  @IsString()
  extra_email: string;

  @IsOptional()
  @IsString()
  own_ordernumber: string;

  @IsString()
  @IsOptional()
  pakjegemak: string;

  @IsOptional()
  @IsString()
  pakjegemak_consumer_housenr: number;

  @IsOptional()
  @IsString()
  pakjegemak_consumer_postalcode: string;

  @IsOptional()
  @IsString()
  upspickup: string;

  @IsOptional()
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  processing_date: string;

  @IsOptional()
  @IsString()
  dhl_postid: string;

  @IsOptional()
  @IsString()
  carrier: string;

  @IsOptional()
  @IsString()
  carrier_service: string;

  @IsOptional()
  @IsString()
  packing_slip_id: string;

  @Type(() => Products)
  products: Products;
}
