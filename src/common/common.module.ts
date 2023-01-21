import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CommonController } from './common.controller';
import { CommonService } from './common.service';
import { CountryLangMap } from './entity/country-lang-map.entity';
import { Country } from './entity/country.entity';
import { CountryCity } from './entity/countryCity.entity';
import { CountryState } from './entity/countryState.entity';
import { LangIso639 } from './entity/iso_639_lang.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      LangIso639,
      Country,
      CountryState,
      CountryCity,
      CountryLangMap,
    ]),
  ],
  controllers: [CommonController],
  providers: [CommonService],
})
export class CommonModule {}
