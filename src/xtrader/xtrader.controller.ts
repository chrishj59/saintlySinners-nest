import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { XtrCategoryDto } from './dtos/xtr-category.dto';
import { XtraderService } from './xtrader.service';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { FindOneNumberParams } from 'src/utils/findOneParamString';
import { XtrProductDto } from './dtos/xtr-product.dto';

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
  async newProduct(@Body() dto: XtrProductDto) {
    return this.productService.newProduct(dto);
  }
}
