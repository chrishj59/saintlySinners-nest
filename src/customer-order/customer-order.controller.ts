import { Body, Controller, Get, Post } from '@nestjs/common';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';

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
}
