import {
  ArrayMinSize,
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEmail,
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
  title: string;

  // @IsString()
  // name: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  // @IsOptional()
  // @IsNumber()
  // houseNumber: number;

  // @IsOptional()
  // @IsString()
  // houseName: string;

  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  street2: string;

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
  telephone: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  orderRef: string;

  @IsOptional()
  @IsNumber()
  ioss: number;
}

export class Product {
  model: string;
  quantity: number;
  // attributeName?: string;
  // attributeValue?: string;
  attributeStr: string;
}
export class Products {
  // @ValidateNested({ each: true })
  // @IsArray()
  // @ArrayNotEmpty()
  // @ArrayMinSize(2)
  // artnr: string[];
  @ValidateNested({ each: true })
  @Type(() => Product)
  product: Product[];
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

  @IsOptional()
  @IsString()
  deliveryCompany: string;

  @IsOptional()
  @IsNumber()
  delivery: number;

  @Type(() => Products)
  products: Product[];
  // @IsArray()
  // @ArrayNotEmpty()
  // @ArrayMinSize(1)
  // products:ProductList[] ;
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
  products: Products[];

  @IsOptional()
  @IsEnum(edcOrderStatusEnum)
  orderStatus: edcOrderStatusEnum;
}
