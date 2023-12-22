import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthorizationGuard } from 'src/authorisation/authorisation.guard';
import { PermissionsGuard } from 'src/authorisation/permissions.guard';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';

import {
  FindOneNumberParams,
  FindOneUUIDParams,
  FindOneStringParams,
} from '../utils/findOneParamString';
import { EdcProductNewDto } from './dtos/add-product.dto';
import { EdcOrderDto } from './dtos/edc-order.dto';
import { EdcService } from './edc.service';
import { EDC_PRODUCT } from './entities/edc-product';
import { EdcPermissions } from './enums/Edc.permissions';
import { EdcProductDto } from './dtos/product.dto';

@Controller()
export class EdcController {
  constructor(private edcService: EdcService) {}
  logger = new Logger('EDC Controller');
  @Get()
  public edcRoot() {
    return 'edc root';
  }

  // @Post('/order')
  // async saveOrder(@Body() dto: EdcOrderDto): Promise<ResponseMessageDto> {
  //   return await this.edcService.saveOrder(dto);
  // }

  // @Post('/order/:id')
  // async sendEdcOrder(
  //   @Param() { id }: FindOneStringParams,
  // ): Promise<ResponseMessageDto> {
  //   return this.edcService.sendOrder(id);
  // }

  @UseGuards(PermissionsGuard([EdcPermissions.CREATE_ADMIN]))
  @UseGuards(AuthorizationGuard)
  @Post('/product')
  async saveProduct(@Body() dto: EdcProductNewDto) {
    return this.edcService.saveProduct(dto);
  }

  @Get('/product/:id')
  async getProduct(@Param() { id }: FindOneNumberParams): Promise<any> {
    return this.edcService.getProductSingle(parseInt(id));
  }

  @Get('/product')
  async getProducts(): Promise<EDC_PRODUCT[]> {
    return this.edcService.getProducts();
  }

  @Get('/productId')
  async getProductId(): Promise<EDC_PRODUCT[]> {
    return this.edcService.getProductIds();
  }

  @Get('/productFiltered')
  async getProductFiltered(@Query() id: EdcProductDto) {
    return this.edcService.productFiltered(id);
  }
}
