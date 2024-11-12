import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PUBLIC_FILE } from 'src/remote-files/entity/publicFile.entity';

import { RemoteFilesModule } from '../remote-files/remote-files.module';
import { StripeModule } from '../stripe/stripe.module';
import { USER } from './entity/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AUTHJS_USER } from './entity/authJsUser.entity';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import { USER_ADDRESS } from './entity/userAddress.entity';
import { XTR_PRODUCT_REVIEW } from 'src/xtrader/entity/xtr-product-review.entity';

//import { StripeService } from '../stripe/stripe.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      USER,
      PUBLIC_FILE,
      AUTHJS_USER,
      XTR_PRODUCT,
      USER_ADDRESS,
      XTR_PRODUCT_REVIEW,
    ]),
    RemoteFilesModule,
    StripeModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
