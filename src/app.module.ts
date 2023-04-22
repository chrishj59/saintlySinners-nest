import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthorisationModule } from './authorisation/authorisation.module';
import { BrandModule } from './brand/brand.module';
import { ChargeModule } from './charge/charge.module';
import { CommonModule } from './common/common.module';
import { CustomerOrderModule } from './customer-order/customer-order.module';
import { DatabaseModule } from './database/database.module';
import { EdcModule } from './edc/edc.module';
import { ItemsModule } from './items/items.module';
import { MessagesModule } from './messages/messages.module';
import { ProductFilesService } from './product-files/product-files.service';
import { RemoteFilesModule } from './remote-files/remote-files.module';
import { StripeModule } from './stripe/stripe.module';
import { UserModule } from './user/user.module';
import { VendorModule } from './vendor/vendor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
        AWS_REGION: Joi.string().required(),
        AWS_ACCESS_KEY_ID: Joi.string().required(),
        AWS_SECRET_ACCESS_KEY: Joi.string().required(),
        AWS_PUBLIC_BUCKET_NAME: Joi.string().required(),
        PORT: Joi.number(),
        STRIPE_SECRET_KEY: Joi.string(),
        STRIPE_CURRENCY: Joi.string(),
        FRONTEND_URL: Joi.string(),
        CLIENT_ORIGIN_URL: Joi.string(),
        ISSUER_BASE_URL: Joi.string(),
        AUDIENCE: Joi.string(),
        EDC_ACCOUNT_EMAIL: Joi.string(),
        EDC_ACCOUNT_API_KEY: Joi.string(),
      }),
    }),
    EdcModule,
    DatabaseModule,
    UserModule,
    RemoteFilesModule,
    BrandModule,
    ItemsModule,
    CommonModule,
    VendorModule,
    StripeModule,
    ChargeModule,
    AuthorisationModule,
    MessagesModule,
    CustomerOrderModule,

    //ProductModule,
  ],

  controllers: [AppController],
  providers: [AppService, ProductFilesService],
})
export class AppModule {}
