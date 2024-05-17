import { Controller, Get, Param } from '@nestjs/common';
import { XtraderCategoryService } from './xtrader-category.service';
import { XTR_CATEGORY } from 'src/xtrader/entity/xtr-Category.entity';
import { FindOneNumberParams } from 'src/utils/findOneParamString';

@Controller()
export class XtraderCategoryController {
  constructor(private readonly categoryService: XtraderCategoryService) {}

  @Get('/getCategoryById')
  public async allCategories(): Promise<XTR_CATEGORY[]> {
    return null;
  }

  @Get('/xtrCategories')
  public async getCategories(): Promise<XTR_CATEGORY[]> {
    return await this.categoryService.getCategories();
  }

  @Get('/xtrCategory-Menu')
  public async menuCategories(): Promise<XTR_CATEGORY[]> {
    return await this.categoryService.categoryMenu();
  }

  @Get('/xtrcategory/:id')
  async getCategory(@Param() { id }): Promise<XTR_CATEGORY> {
    return await this.categoryService.getCategoryById(parseInt(id));
  }
}
