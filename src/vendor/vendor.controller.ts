import { Controller, Get } from '@nestjs/common';

import { PRODUCT_VENDOR } from './entity/vendor.entity';
import { VendorService } from './vendor.service';

@Controller()
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('/vendor')
  public async allVendors(): Promise<PRODUCT_VENDOR[]> {
    return await this.vendorService.allVendors();
  }
}
