import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from 'src/vendor/entity/vendor.entity';

import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { CountryLangMap } from './entity/country-lang-map.entity';
import { Country } from './entity/country.entity';
import { CountryCity } from './entity/countryCity.entity';
import { CountryState } from './entity/countryState.entity';
import { DeliveryCharge } from './entity/delivery-charges.entity';
import { DeliveryCourier } from './entity/delivery-courier.entity';
import { LangIso639 } from './entity/iso_639_lang.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LangIso639,
      Country,
      CountryState,
      CountryCity,
      CountryLangMap,
      DeliveryCharge,
      DeliveryCourier,
      Vendor,
    ]),
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
