import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';

import { EdcProductNewDto } from './dtos/add-product.dto';
import { ProductIdDto } from './dtos/product-id.dto';
import { EdcService } from './edc.service';
import { EDC_PRODUCT } from './entities/edc-product';

@Controller()
export class EdcController {
  constructor(private edcService: EdcService) {}
  logger = new Logger('EDC Controller');
  @Get()
  public edcRoot() {
    return 'edc root';
  }

  @Post('/product')
  async saveProduct(@Body() dto: EdcProductNewDto) {
    return this.edcService.saveProduct(dto);
  }

  @Get('/product/:id')
  async getProduct(@Param() dto: ProductIdDto): Promise<any> {
    return this.edcService.getProductSingle(dto);
  }

  @Get('/product')
  async getProducts(): Promise<EDC_PRODUCT[]> {
    return this.edcService.getProducts();
  }

  @Get('/productId')
  async getProductId(): Promise<EDC_PRODUCT[]> {
    return this.edcService.getProductIds();
  }
}
