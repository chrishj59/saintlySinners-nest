import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { XtrCategoryDto } from './dtos/xtr-category.dto';
import { XtraderService } from './xtrader.service';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { FindOneNumberParams } from 'src/utils/findOneParamString';
import { XtrProductDto } from './dtos/xtr-product.dto';
import { XTR_PRODUCT } from './entity/xtr-product.entity';
import { XtrProductFilterDto } from './dtos/xtr-prod-filter.dto';
import { XTR_BRAND } from './entity/xtr-brand.entity';
import { BrandService } from '../brand/brand.service';
import { Brand } from '../edc/dtos/add-product.dto';
import { XtrBrandDto } from './dtos/xtr-brand.dto';
import {
  XtraderStockLevel,
  xtrStockLevelUpdateResp,
} from './dtos/xtr-stock-level.dto';
import { ProductRestrictedDto } from './dtos/xtr-prod-restricted.dto';
import { restrProdRespType } from 'src/xtrader/types/xtrRestrictedProdResponse.type';
import { request } from 'http';
import { Request } from 'express';

@Controller()
export class XtraderController {
  constructor(
    private readonly brandService: XtraderService,
    private readonly categoryService: XtraderService,
    private readonly productService: XtraderService,
  ) {}
  logger = new Logger('XtraderController');
  @Get('/xtrBrand')
  async getAllBrands(): Promise<XTR_BRAND[]> {
    return this.brandService.getAllBrands();
  }

  @Get('/xtrBrandsHomePage')
  async getHomePageBrands(@Req() request: Request): Promise<XTR_BRAND[]> {
    this.logger.log(`xtrBrandsHomePage called from ip ${request.ip}`);
    return await this.brandService.getHomePageBrands();
  }

  @Patch(`/xtrBrand`)
  async updateBrand(@Body() dto: XtrBrandDto): Promise<XTR_BRAND> {
    return this.brandService.updateBrand(dto);
  }

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
  async productPost(@Body() dto: XtrProductDto): Promise<XTR_PRODUCT> {
    return this.productService.productPost(dto);
  }

  @Post('/xtrStockLevel')
  async updateStockLevel(
    @Body() dto: XtraderStockLevel,
  ): Promise<xtrStockLevelUpdateResp> {
    return this.productService.updateStockLevel(dto);
  }

  @Post('/xtrRestrictedProduct')
  async restrictedProductPost(
    @Body() dto: ProductRestrictedDto,
  ): Promise<restrProdRespType> {
    return await this.productService.restrictedProductPost(dto);
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
