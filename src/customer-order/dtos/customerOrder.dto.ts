import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';
import { edcOrderStatusEnum } from 'src/edc/enums/Edc-order-status.enum';

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
  artnr: string[];
}

export class CustomerOrderDto {
  @IsNumber()
  vendorNumber: number;

  @IsOptional()
  @IsString()
  stripeSessionId?: string;

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

  // @Type(() => Product)
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  products: string[];
}

export class EditCustomerOrderDto {
  @IsOptional()
  @IsNumber()
  vendorNumber: number;

  @IsOptional()
  @IsString()
  stripeSession: string;

  @IsOptional()
  @IsBoolean()
  oneTimeCustomer: boolean;

  // @IsOptional()
  // // @Type(() => Customer)
  // customer: string;

  @IsOptional()
  @IsString()
  customerId: string;

  @IsOptional()
  @IsNumber()
  goodsValue: number;

  @IsOptional()
  @IsNumber()
  tax: number;

  @IsOptional()
  @IsNumber()
  total: number;

  @IsOptional()
  @IsString()
  currencyCode: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayMinSize(1)
  products: string[];

  @IsOptional()
  @IsEnum(edcOrderStatusEnum)
  orderStatus: edcOrderStatusEnum;
}
