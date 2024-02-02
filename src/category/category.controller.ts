import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
  Put,
  Query,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryIdDto } from './dtos/categoryId.dto';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { EDC_CATEGORY } from 'src/edc/entities/edc-category.entity';
import { CategoryDto } from './dtos/category.dto';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';

@Controller()
// @SerializeOptions({
//   strategy: 'excludeAll'
// })
export class CategoryController {
  constructor(private catService: CategoryService) {}

  logger = new Logger('Category controller');

  @Get('/category')
  public async allCategories(
    @Query() dto: CategoryDto,
  ): Promise<EDC_CATEGORY[] | EDC_CATEGORY> {
    return this.catService.category(dto);
  }

  @Put('/category/:id')
  public async updateCategory(@Body() dto: CategoryDto) {
    return this.catService.updateCategories(dto);
  }

  @Get('/productByCategoryId')
  public async productByCategoryid(
    @Query() dto: CategoryIdDto,
  ): Promise<XTR_PRODUCT[] | ResponseMessageDto> {
    return await this.catService.getCategoryProducts(dto);
  }
}
