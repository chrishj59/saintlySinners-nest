import {
  IsBoolean,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
  ValidateNested,
} from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export class Ean {
  @IsString()
  ean: string;

  @IsString()
  value: string;
}
export class AttributeValue {
  @IsNumber()
  value: number;

  @IsString()
  title: string;

  @IsNumberString()
  priceAdjustment: string;
}

export class AttributeValues {
  // @ValidateNested({ each: true })
  // @Type(() => AttributeValue)
  attributeValue: AttributeValue;
}

export class Attribute {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsOptional()
  @Type(() => AttributeValues)
  attributeValues: AttributeValue[];
}

export class Eans {
  @ValidateNested({ each: true })
  @Type(() => Ean)
  ean: Ean[];
}

export class XtrProductDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsOptional()
  @IsNumber()
  weight: number;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  model: string;

  @IsOptional()
  @IsNumber()
  goodsPrice: number;

  @IsOptional()
  @IsNumber()
  privateStockPrice: number;

  @IsOptional()
  @IsNumber()
  caseSize: number;

  @IsOptional()
  @IsNumber()
  retailPrice: number;

  @IsString()
  thumb: string;

  @IsString()
  ximage: string;

  @IsOptional()
  @IsString()
  ximage2: string;

  @IsOptional()
  @IsString()
  ximage3: string;

  @IsOptional()
  @IsString()
  ximage4: string;

  @IsOptional()
  @IsString()
  ximage5: string;

  @IsOptional()
  @IsString()
  multi1: string;

  @IsOptional()
  @IsString()
  multi2: string;

  @IsOptional()
  @IsString()
  multi3: string;

  @IsOptional()
  @IsString()
  bigmulti1: string;

  @IsOptional()
  @IsString()
  bigmulti2: string;

  @IsOptional()
  @IsString()
  bigmulti3: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  descriptionHtml: string;

  @IsOptional()
  @IsNumber()
  ean: number;

  @IsOptional()
  @IsString()
  length: string;

  @IsOptional()
  @IsString()
  lubeType: string;

  @IsOptional()
  @IsString()
  condomSafe: boolean;

  @IsOptional()
  @IsString()
  liquidVolume: number;

  @IsOptional()
  @IsString()
  liquidVolumeUom: string;

  @IsOptional()
  @IsString()
  washdown: string;

  @IsOptional()
  @IsBoolean()
  insertableToy: boolean;

  @IsOptional()
  @IsNumber()
  diameter: number;

  @IsOptional()
  @IsString()
  diameterUom: string;

  @IsOptional()
  @IsNumber()
  originCircum: number;

  @IsOptional()
  @IsString()
  originCircumUom: string;

  @IsOptional()
  @IsNumber()
  originDiam: number;

  @IsOptional()
  @IsString()
  originDiamUom: string;

  @IsOptional()
  @IsNumber()
  circumference: number;

  @IsOptional()
  @IsString()
  circumferenceUom: string;

  @IsOptional()
  @IsString()
  colour: string;

  @IsOptional()
  @IsString()
  flexbility: string;

  @IsOptional()
  @IsString()
  controller: string;

  @IsOptional()
  @IsString()
  forWho: string;

  @IsOptional()
  @IsString()
  whatIsIt: string;

  @IsOptional()
  @IsString()
  for: string;

  @IsOptional()
  @IsString()
  motion: string;

  @IsOptional()
  @IsString()
  feature: string;

  @IsOptional()
  @IsString()
  misc: string;

  @IsOptional()
  @IsBoolean()
  waterproof: boolean;

  @IsOptional()
  @IsString()
  material: string;

  @IsOptional()
  @IsString()
  brand: string;

  @IsOptional()
  @IsString()
  style: string;

  @IsOptional()
  @IsString()
  power: string;

  @IsOptional()
  @IsString()
  size: string;

  @IsOptional()
  @IsString()
  opening: string;

  @IsOptional()
  @IsString()
  catName: string;

  @IsOptional()
  @IsString()
  washing: string;

  @IsOptional()
  @Type(() => Ean)
  eans: Ean[];

  @IsOptional()
  attribute: Attribute;
}
