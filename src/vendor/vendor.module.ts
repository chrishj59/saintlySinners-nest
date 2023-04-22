import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PRODUCT_VENDOR } from './entity/vendor.entity';
import { VendorController } from './vendor.controller';
import { VendorService } from './vendor.service';

@Module({
  imports: [TypeOrmModule.forFeature([PRODUCT_VENDOR])],
  controllers: [VendorController],
  providers: [VendorService],
})
export class VendorModule {}
