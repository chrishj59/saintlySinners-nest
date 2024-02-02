import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { XtrCategoryDto } from './dtos/xtr-category.dto';
import { XtraderService } from './xtrader.service';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { FindOneNumberParams } from 'src/utils/findOneParamString';
import { XtrProductDto } from './dtos/xtr-product.dto';
import { XTR_PRODUCT } from './entity/xtr-product.entity';
import { XtrProductFilterDto } from './dtos/xtr-prod-filter.dto';

@Controller()
export class XtraderController {
  constructor(
    private readonly categoryService: XtraderService,
    private readonly productService: XtraderService,
  ) {}

  @Post('/xtrCat')
  async newCategory(@Body() dto: XtrCategoryDto): Promise<XTR_CATEGORY> {
    return this.categoryService.newCategory(dto);
  }

  @Get('/xtrCat/:id')
  async getCategory(
    @Param() { id }: FindOneNumberParams,
  ): Promise<XTR_CATEGORY> {
    return this.categoryService.getOneCategory(id);
  }

  @Post('/xtrProd')
  async newProduct(@Body() dto: XtrProductDto): Promise<XTR_PRODUCT> {
    return this.productService.newProduct(dto);
  }

  @Get('/xtrProd/:id')
  async getProduct(@Param() { id }: FindOneNumberParams): Promise<XTR_PRODUCT> {
    return await this.productService.getProduct(parseInt(id));
  }

  @Get('/xtrProductId')
  async getProductId(): Promise<number[]> {
    return await this.productService.getProductIds();
  }

  @Get('/xtrProductFiltered')
  async getProductFiltered(@Query() searchParam: XtrProductFilterDto) {
    return this.productService.getProductsFiltered(searchParam);
  }
}
