import { Controller, Get, Post, Body } from '@nestjs/common';

import { PRODUCT_VENDOR } from './entity/vendor.entity';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dtos/vendor.dto';

@Controller()
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('/vendor')
  public async allVendors(): Promise<PRODUCT_VENDOR[]> {
    return await this.vendorService.allVendors();
  }
  @Post('/vendor')
  public async saveVendor(
    @Body() dto: CreateVendorDto,
  ): Promise<PRODUCT_VENDOR> {
    return this.vendorService.postVendor(dto);
  }
}
