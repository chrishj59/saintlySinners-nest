import { Controller, Get } from '@nestjs/common';

import { Vendor } from './entity/vendor.entity';
import { VendorService } from './vendor.service';

@Controller()
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Get('/vendor')
  public async allVendors(): Promise<Vendor[]> {
    return await this.vendorService.allVendors();
  }
}
