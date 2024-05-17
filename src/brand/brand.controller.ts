import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';

import { BrandService } from './brand.service';
import { BrandCatDto } from './dtos/brand-cat.dto';
import { BrandIdDto, XtrBrandIdDto } from './dtos/brand-id.dto';
import { BrandDto } from './dtos/brand.dto';
import { EDC_BRAND } from 'src/edc/entities/edc-brand';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import daysToWeeks from 'date-fns/daysToWeeks/index.js';
import { Logger } from '@nestjs/common';

@Controller()
export class BrandController {
  constructor(private brandService: BrandService) {}
  logger = new Logger('Brand Controller');
  @Get('/brand')
  public async getBrands(
    @Query() dto: BrandCatDto,
  ): Promise<BrandDto[] | BrandDto> {
    if (!dto.catLevel) {
      dto.catLevel = 6;
    }

    return await this.brandService.getBrand(dto);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/brand')
  public async addBrand(@Body() dto: BrandDto): Promise<EDC_BRAND> {
    return await this.brandService.addBrand(dto);
  }

  @Put('/brand')
  public async updateBrand(
    @Body() dto: BrandDto,
  ): Promise<BrandDto | ResponseMessageDto> {
    return await this.brandService.updateBrand(dto);
  }

  @Get('/productByBrandId')
  public async getBrandId(
    @Query() dto: BrandIdDto,
  ): Promise<EDC_PRODUCT[] | ResponseMessageDto> {
    return this.brandService.getBrandProducts(dto);
  }

  @Get('/xtrProductByBrandId')
  public async getxtrProdByBrandId(
    @Query() dto: BrandIdDto,
  ): Promise<XTR_PRODUCT[]> {
    return await this.brandService.getXtrBrandProducts(dto);
  }
}
