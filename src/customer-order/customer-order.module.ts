import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/common/entity/country.entity';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import { RemoteFilesModule } from 'src/remote-files/remote-files.module';
import { NotificationModule } from 'src/notification/notification.module';
import { USER } from 'src/user/entity/user.entity';
import { PRODUCT_VENDOR } from 'src/vendor/entity/vendor.entity';

import { CustomerOrderController } from './customer-order.controller';
import { CustomerOrderService } from './customer-order.service';
import { CUSTOMER_ORDER } from './entities/customerOrder.entity';
import { CUSTOMER_ORDER_LINE } from './entities/customerOrderLine.entity';
import { ONE_TIME_CUSTOMER } from './entities/customerOrderCustomer.entity';
import { CUSTOMER_ORDER_PRODUCT } from './entities/customerOrderProduct.entity';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import { HttpModule } from '@nestjs/axios';
import { AwsModule } from 'src/aws/aws.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CUSTOMER_ORDER,
      ONE_TIME_CUSTOMER,
      PRODUCT_VENDOR,
      CUSTOMER_ORDER_LINE,
      CUSTOMER_ORDER_PRODUCT,
      EDC_PRODUCT,
      Country,
      USER,
      XTR_PRODUCT,
    ]),
    RemoteFilesModule,
    NotificationModule,
    HttpModule,
    AwsModule,
  ],

  controllers: [CustomerOrderController],
  providers: [CustomerOrderService],
})
export class CustomerOrderModule {}
