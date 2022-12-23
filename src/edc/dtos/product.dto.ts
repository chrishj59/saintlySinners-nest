import { IsString } from 'class-validator';

export class EdcProductDto {
  @IsString()
  id: string;

  // @IsString({ each: true })
  // artnr: string;

  // @IsString({ each: true })
  // title: string;

  // @IsString({ each: true })
  // description: string;

  // @IsString({ each: true })
  // casecount: string;

  // @Type(() => Brand)
  // brand: Brand[];

  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // date: string;

  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // modifydate: string;

  // @Type(() => Variants)
  // variants: Variants[];

  // @Type(() => Price)
  // price: Price[];

  // @Type(() => Categories)
  // categories: Categories;

  // @Type(() => Measures)
  // measures: Measures;

  // @Type(() => Properties)
  // properties: Properties;

  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // material: string;

  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // popularity: string;

  // @Type(() => Pics)
  // pics: Pics;

  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // country: string;

  // @Type(() => BulletPoints)
  // bulletpoints: BulletPoints;

  // @Type(() => Restrictions)
  // restrictions: Restrictions;

  // @IsOptional()
  // @IsArray()
  // @ArrayNotEmpty()
  // @IsString({ each: true })
  // hscode: string;

  // @IsOptional()
  // @Type(() => Battery)
  // battery: Battery;

  // @Type(() => Categories)
  // new_categories: Categories;
}
