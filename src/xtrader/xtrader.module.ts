import { Module } from '@nestjs/common';
import { XtraderService } from './xtrader.service';
import { XtraderController } from './xtrader.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { XTR_CATEGORY_IMAGE_REMOTE_FILE } from 'src/remote-files/entity/xtrCategoryFile.entity';
import { RemoteFilesModule } from 'src/remote-files/remote-files.module';
import { HttpModule } from '@nestjs/axios';
import { CommonModule } from 'src/common/common.module';
import { XTR_PRODUCT } from './entity/xtr-product.entity';
import { XTR_PRODUCT_IMAGE_REMOTE_FILE } from 'src/remote-files/entity/stockFile.entity';
import { XTR_BRAND } from './entity/xtr-brand.entity';

import { XTR_FEATURE } from './entity/xtr-feature.entity';
import { XTR_PROD_ATTRIBUTE_EAN } from './entity/xtr-prod-attribute-ean.entity';
import { XTR_ATTRIBUTE_VALUE } from './entity/xtr-attribute-value.entity';
import { XTR_PROD_ATTRIBUTE } from './entity/xtr-prod-attribute.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      XTR_CATEGORY,
      XTR_CATEGORY_IMAGE_REMOTE_FILE,
      XTR_PRODUCT,
      XTR_PRODUCT_IMAGE_REMOTE_FILE,
      XTR_BRAND,
      XTR_PROD_ATTRIBUTE_EAN,
      XTR_FEATURE,
      XTR_ATTRIBUTE_VALUE,
      XTR_PROD_ATTRIBUTE,
    ]),
    RemoteFilesModule,
    HttpModule,

    CommonModule,
  ],
  providers: [XtraderService],
  controllers: [XtraderController],
})
export class XtraderModule {}
