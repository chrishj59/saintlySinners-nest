import { Body, Controller, Post } from '@nestjs/common';

import { CommonService } from './common.service';
import { CountryDto } from './dtos/country.dto';
import { Country } from './entity/country.entity';

@Controller()
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  @Post('/countryLoad')
  public async loadCountry(@Body() dto: CountryDto): Promise<Country> {
    return this.commonService.addCountry(dto);
  }
}
