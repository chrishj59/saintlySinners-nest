import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthzModule } from './authz/authz.module';
import { BrandModule } from './brand/brand.module';
import { DatabaseModule } from './database/database.module';
import { EdcModule } from './edc/edc.module';
import { ItemsModule } from './items/items.module';
import { ProductFilesService } from './product-files/product-files.service';
import { RemoteFilesModule } from './remote-files/remote-files.module';
import { UserModule } from './user/user.module';
import { CommonModule } from './common/common.module';
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
      }),
    }),
    EdcModule,
    DatabaseModule,
    UserModule,
    RemoteFilesModule,
    BrandModule,
    AuthzModule,
    ItemsModule,
    CommonModule,
    VendorModule,
    //ProductModule,
  ],

  controllers: [AppController],
  providers: [AppService, ProductFilesService],
})
export class AppModule {}
