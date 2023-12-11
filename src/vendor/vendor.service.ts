import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PRODUCT_VENDOR } from './entity/vendor.entity';
import { CreateVendorDto } from './dtos/vendor.dto';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(PRODUCT_VENDOR)
    private vendorRepository: Repository<PRODUCT_VENDOR>,
  ) {}
  public async allVendors(): Promise<PRODUCT_VENDOR[]> {
    return this.vendorRepository.find({ select: ['id', 'name'] });
  }

  public async postVendor(dto: CreateVendorDto): Promise<PRODUCT_VENDOR> {
    console.log(`Post vendor received param ${JSON.stringify(dto, null, 2)}`);
    const vendor = new PRODUCT_VENDOR();
    vendor.name = dto.name;

    return await this.vendorRepository.save(vendor, { reload: true });
  }
}
