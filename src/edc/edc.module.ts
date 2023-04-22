import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from 'src/common/common.module';
import { EDC_PRODUCT_FILE } from 'src/remote-files/entity/productFile.entity';
import { RemoteFilesModule } from 'src/remote-files/remote-files.module';

import { EdcController } from './edc.controller';
import { EdcService } from './edc.service';
import { EDC_BATTERY } from './entities/edc-battery';
import { EDC_BRAND } from './entities/edc-brand';
import { EDC_MATERIAL } from './entities/edc-material';
import { EDC_MEASURE } from './entities/edc-measure';
import { EDC_NEW_CATEGORY } from './entities/edc-new-category.entity';
import { EDC_PRICE } from './entities/edc-price';
import { EDC_PRODUCT } from './entities/edc-product';
import { EDC_PRODUCT_BULLET } from './entities/edc-product-bullet-point.entity';
import { EDC_PRODUCT_RESTRICTION } from './entities/edc-product-restrictions.entity';
import { EDC_PROP_VALUE } from './entities/edc-prop-value';
import { EDC_PROPERTY } from './entities/edc-property';
import { EDC_VARIANT } from './entities/edc-variant';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EDC_PRODUCT,
      EDC_BRAND,
      EDC_BATTERY,
      EDC_MEASURE,
      EDC_VARIANT,
      EDC_MATERIAL,
      EDC_PROP_VALUE,
      EDC_PROPERTY,
      EDC_PRICE,
      EDC_PRODUCT_FILE,
      EDC_PRODUCT_BULLET,
      EDC_PRODUCT_RESTRICTION,
      EDC_NEW_CATEGORY,
    ]),
    RemoteFilesModule,
    HttpModule,

    CommonModule,
  ],
  providers: [EdcService],
  controllers: [EdcController],
})
export class EdcModule {}
