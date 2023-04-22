import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PRODUCT_VENDOR } from './entity/vendor.entity';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(PRODUCT_VENDOR)
    private vendorRepository: Repository<PRODUCT_VENDOR>,
  ) {}
  public async allVendors(): Promise<PRODUCT_VENDOR[]> {
    return this.vendorRepository.find({ select: ['id', 'name'] });
  }
}
