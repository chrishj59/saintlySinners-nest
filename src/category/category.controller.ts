import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Logger,
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

@Controller()
// @SerializeOptions({
//   strategy: 'excludeAll'
// })
export class CategoryController {
  constructor(private catService: CategoryService) {}

  logger = new Logger('Category controller');
  //@UseInterceptors(ClassSerializerInterceptor)

  @Get('/category')
  public async allCategories(
    @Query() dto: CategoryDto,
  ): Promise<EDC_CATEGORY[] | EDC_CATEGORY> {
    return this.catService.category(dto);
  }
  @Get('/productByCategoryId')
  public async productByCategoryid(
    @Query() dto: CategoryIdDto,
  ): Promise<EDC_PRODUCT[] | ResponseMessageDto> {
    const res = await this.catService.getCategoryProducts(dto);
    return res;
  }
}
