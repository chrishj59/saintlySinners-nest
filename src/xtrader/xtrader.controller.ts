import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { XtrCategoryDto } from './dtos/xtr-category.dto';
import { XtraderService } from './xtrader.service';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { FindOneNumberParams } from 'src/utils/findOneParamString';

@Controller()
export class XtraderController {
  constructor(private readonly categoryService: XtraderService) {}

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
}
