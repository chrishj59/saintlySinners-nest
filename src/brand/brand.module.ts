import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EDC_BRAND } from 'src/edc/entities/edc-brand';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';

import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';

@Module({
  imports: [TypeOrmModule.forFeature([EDC_BRAND, EDC_PRODUCT])],
  controllers: [BrandController],
  providers: [BrandService],
})
export class BrandModule {}
