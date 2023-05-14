import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Post,
  StreamableFile,
} from '@nestjs/common';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { FindOneUUIDParams } from 'src/utils/findOneParamString';

import { CustomerOrderService } from './customer-order.service';
import { CustomerOrderDto } from './dtos/customerOrder.dto';

@Controller()
export class CustomerOrderController {
  constructor(private customerService: CustomerOrderService) {}

  @Get('/order')
  async getOrder() {
    return 'order to be implemented';
  }
  @Post('/customerOrder')
  async saveOrder(@Body() dto: CustomerOrderDto): Promise<ResponseMessageDto> {
    return await this.customerService.saveOrder(dto);
  }

  @Post('/customerInvoice')
  async createInvoicePdf() {
    return '/customerInvoice called';
  }

  @Get('/customerOrder/:id')
  async getCustomerOrder(@Param() { id }: FindOneUUIDParams): Promise<any> {
    return `Called /customerOrder/ with ${id}`;
  }

  @Get('/customerInvoice/:id')
  @Header('Content-Type', 'application/pdf')
  async getCustomerInvoice(
    @Param() { id }: FindOneUUIDParams,
  ): Promise<StreamableFile> {
    const pdfStream = await this.customerService.getCutomerOrder(id);
    return new StreamableFile(pdfStream);
  }
}
