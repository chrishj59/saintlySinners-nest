import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsDecimal, IsNumber, IsOptional, IsString, ValidateNested } from 'class-validator';

//import { Tag } from 'src/common/entities/tag.entity';
export class Cat {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  id: string;
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  title: string;
}

export class CatExtra {
  @ValidateNested({ each: true })
  @Type(() => Cat)
  cat: Cat[];
}

export class Category {
  @ValidateNested({ each: true })
  @Type(() => CatExtra)
  category: CatExtra[];
}

export class Categories {
  @ValidateNested({ each: true })
  @Type(() => Category)
  categories: Category[];
}

export class Variant {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  type: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  subartnr: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  ean: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  stock: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  stockestimate: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  title: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  weeknr: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  nova: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  remaining: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  remainingQuantity: string;
}

export class Variants {
  @ValidateNested({ each: true })
  @Type(() => Variant)
  variant: Variant[];
}

export class Brand {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  b2b: string;
}

export class Price {
  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal()
  currency: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal()
  b2b: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal()
  b2c: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal()
  vatnl: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal()
  vatde: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal()
  vatfr: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal()
  vatuk: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsString()
  discount: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal()
  minprice: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsDecimal()
  baseprice: number;
}
export class Pics {
  @IsArray()
  @ArrayNotEmpty()
  @IsString()
  pic: string;
}
export class Measures {
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber()
  weight: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString()
  packing: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString()
  contents: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString()
  length: string;
}

export class Value {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  title: string;
}

export class Values {
  @ValidateNested({ each: true })
  @Type(() => Value)
  value: Value[];
}

export class Prop {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  propId: string;

  @Type(() => Value)
  values: Value[];
}

export class Properties {
  @ValidateNested({ each: true })
  @Type(() => Prop)
  prop: Prop[];
}

export class BulletPoint {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  title: string;
}

export class BulletPoints {
  @ValidateNested({ each: true })
  @Type(() => BulletPoint)
  p: BulletPoint[];
}

export class Germany {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  restricted: string;
}

export class platform {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  restricted: string;
}

export class Restrictions {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  germany: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  platform: string;
}

export class Required {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  platform: string;
}

export class Battery {
  @ValidateNested({ each: true })
  @Type(() => Required)
  required: Required;
}

export class EdcProductNewDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  id: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  artnr: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  title: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  description: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  casecount: string;

  @Type(() => Brand)
  brand: Brand[];

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  date: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  modifydate: string;

  @Type(() => Variants)
  variants: Variants[];

  @Type(() => Price)
  price: Price[];

  @Type(() => Categories)
  categories: Categories;

  @Type(() => Measures)
  measures: Measures;

  @Type(() => Properties)
  properties: Properties;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  material: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  popularity: string;

  @Type(() => Pics)
  pics: Pics;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  country: string;

  @Type(() => BulletPoints)
  bulletpoints: BulletPoints;

  @Type(() => Restrictions)
  restrictions: Restrictions;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  hscode: string;

  @IsOptional()
  @Type(() => Battery)
  battery: Battery;

  @Type(() => Categories)
  new_categories: Categories;
}
