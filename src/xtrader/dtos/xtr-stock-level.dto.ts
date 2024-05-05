import { IsOptional, IsString } from '@nestjs/class-validator';
import { Type } from 'class-transformer';

export type stockItemType = {
  level: string;
};

export type StockSizeType = {
  size: string;
  level: string;
};
export type xtraderStockItem = {
  item: string;
  name: string;
  stockItem?: StockItem;
  stockSizes?: StockSizeType[];
};
export type xtraderStockLevelDto = {
  products: xtraderStockItem[];
};

export class StockItem {
  @IsString()
  level: string;
}

export class StockSize {
  @IsString()
  size: string;
  @IsString()
  level: string;
}

export class XtraderStockItem {
  @IsString()
  item: string;

  @IsString()
  name: string;

  @IsOptional()
  @Type(() => StockItem)
  stockItem: StockItem;

  @IsOptional()
  @Type(() => StockSize)
  stockSizes: StockSize[];
}

export class XtraderStockLevel {
  @Type(() => XtraderStockItem)
  products: XtraderStockItem[];
}

export type xtrStockLevelUpdateResp = {
  inStock: number;
  outOfStock: number;
  inStockSize: number;
  outOfStockSize: number;
};
