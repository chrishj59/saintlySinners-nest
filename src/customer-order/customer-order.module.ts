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
import { ORDER_CUSTOMER } from './entities/OrderCustomer.entity';
import { CUSTOMER_ORDER_PRODUCT } from './entities/customerOrderProduct.entity';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import { HttpModule } from '@nestjs/axios';
import { AwsModule } from 'src/aws/aws.module';
import { CUSTOMER_ORDER_DELIVERY } from './entities/customerOrderDelivery.entity';
import { DeliveryCharge } from 'src/common/entity/delivery-charges.entity';
import { AUTHJS_USER } from 'src/user/entity/authJsUser.entity';
import { USER_ADDRESS } from 'src/user/entity/userAddress.entity';
import { DELIVERY_ADDRESS } from './entities/deliveryAddress.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CUSTOMER_ORDER,
      ORDER_CUSTOMER,
      DELIVERY_ADDRESS,
      PRODUCT_VENDOR,
      CUSTOMER_ORDER_LINE,
      CUSTOMER_ORDER_PRODUCT,
      CUSTOMER_ORDER_DELIVERY,
      DeliveryCharge,
      EDC_PRODUCT,
      Country,
      AUTHJS_USER,
      XTR_PRODUCT,
      USER_ADDRESS,
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
