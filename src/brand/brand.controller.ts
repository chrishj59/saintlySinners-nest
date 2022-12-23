import { Body, Controller, Get, Put, Query } from '@nestjs/common';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';

import { BrandService } from './brand.service';
import { BrandCatDto } from './dtos/brand-cat.dto';
import { BrandIdDto } from './dtos/brand-id.dto';
import { BrandDto } from './dtos/brand.dto';

@Controller()
export class BrandController {
  constructor(private brandService: BrandService) {}

  @Get('/brand')
  public async getBrands(
    @Query() dto: BrandCatDto,
  ): Promise<BrandDto[] | BrandDto> {
    console.log('category');

    if (!dto.catLevel) {
      dto.catLevel = 6;
    }

    console.log(`dto.catLeel ${dto.catLevel}`);
    console.log(dto);
    return await this.brandService.getBrand(dto);
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
}
