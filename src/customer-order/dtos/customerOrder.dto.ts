import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

class Customer {
  @IsOptional()
  @IsString()
  customerTitle: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  houseNumber: number;

  @IsOptional()
  @IsString()
  houseName: string;

  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  county: string;

  @IsOptional()
  @IsNumber()
  country: number;

  @IsOptional()
  @IsString()
  postCode: string;

  @IsOptional()
  @IsNumber()
  zip: number;

  @IsOptional()
  @IsString()
  telphone: string;
}

export class Product {
  @ValidateNested({ each: true })
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(2)
  @IsString()
  artnr: string[];
}

export class CustomerOrderDto {
  @IsNumber()
  vendorNumber: number;

  @IsString()
  stripeSessionId: string;

  @IsBoolean()
  oneTimeCustomer: boolean;

  @IsOptional()
  @Type(() => Customer)
  customer: Customer;

  @IsOptional()
  @IsString()
  customerId: string;

  @IsNumber()
  goodsValue: number;

  @IsNumber()
  tax: number;

  @IsNumber()
  total: number;

  @IsString()
  currencyCode: string;

  @Type(() => Product)
  products: Product;
}
