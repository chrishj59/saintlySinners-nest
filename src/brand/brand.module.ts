import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EDC_BRAND } from 'src/edc/entities/edc-brand';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';

import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import { XTR_BRAND } from 'src/xtrader/entity/xtr-brand.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EDC_BRAND, EDC_PRODUCT, XTR_PRODUCT, XTR_BRAND]),
  ],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
