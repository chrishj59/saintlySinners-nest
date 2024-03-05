import {
  Body,
  Controller,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Put,
  StreamableFile,
} from '@nestjs/common';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import FindOneStringParams, {
  FindOneUUIDParams,
} from 'src/utils/findOneParamString';

import { CustomerOrderService } from './customer-order.service';
import {
  CustomerOrderDto,
  EditCustomerOrderDto,
} from './dtos/customerOrder.dto';
import { CUSTOMER_ORDER } from './entities/customerOrder.entity';
import { EdcOrderCreatedResponseDto } from 'src/dtos/edc-order-created.reponse.dto';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';
import { CustOrderUpdatedResponseDto } from 'src/dtos/cust-order-updated.response.dto';

@Controller()
export class CustomerOrderController {
  constructor(private customerService: CustomerOrderService) {}

  @Get('/order')
  async getOrder(): Promise<CUSTOMER_ORDER[]> {
    return await this.customerService.getOrders();
  }

  @Post('/customerOrder')
  async saveOrder(
    @Body() dto: CustomerOrderDto,
  ): Promise<ResponseMessageDto | EdcOrderCreatedResponseDto> {
    return await this.customerService.saveOrder(dto);
  }

  @Patch('/customerOrderPaid/:id')
  public async updateCustomerOrder(
    @Param() paramId: FindOneStringParams,
    @Body() custOrder: EditCustomerOrderDto,
  ): Promise<CustOrderUpdatedResponseDto> {
    console.log(`id is: ${JSON.stringify(paramId.id)}`);
    console.log(`body is ${JSON.stringify(custOrder)}`);

    const updatedOrder: CustOrderUpdatedResponseDto =
      await this.customerService.customerOrderPaid(paramId.id, custOrder);

    return {
      status: updatedOrder.status,
      orderMessage: updatedOrder.orderMessage,
    };
  }

  // @Patch('/customerOrder/:id')
  // public async updateCustomerOrder(
  //   @Param() paramId: FindOneStringParams,
  //   @Body() custOrder: EditCustomerOrderDto,
  // ): Promise<CustOrderUpdatedResponseDto> {
  //   console.log(`id is: ${JSON.stringify(paramId.id)}`);
  //   const updatedOrder: CustOrderUpdatedResponseDto =
  //     await this.customerService.updateCustomerOrder(paramId.id, custOrder);

  //   return {
  //     status: updatedOrder.status,
  //     orderMessage: updatedOrder.orderMessage,
  //   };
  // }

  @Post('/customerInvoice')
  async createInvoicePdf() {
    return '/customerInvoice called';
  }

  @Get('/customerOrder/:id')
  async getCustomerOrder(
    @Param() { id }: FindOneUUIDParams,
  ): Promise<CUSTOMER_ORDER> {
    return await this.customerService.getCustomerOrder(id);
  }

  @Get('/customerInvoice/:id')
  @Header('Content-Type', 'application/pdf')
  async getCustomerInvoice(
    @Param() { id }: FindOneUUIDParams,
  ): Promise<StreamableFile> {
    const pdfStream = await this.customerService.getCustomerInvoice(id);
    return new StreamableFile(pdfStream);
  }
}
