import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CountryDto } from './dtos/country.dto';
import { Country } from './entity/country.entity';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  public async addCountry(dto: CountryDto): Promise<Country> {
    console.log('common service addCountry');
    console.log(dto);
    const country = new Country();
    country.id = dto.id;
    country.capital = dto.capital;
    country.currency = dto.currency;
    country.currencySymbol = dto.currencySymbol;
    country.emoji = dto.emoji;
    country.emojiu = dto.emojiu;
    country.iso2 = dto.iso2;
    country.iso3 = dto.iso3;
    country.langCode = dto.langCode;
    country.langName = dto.langName;
    country.lat = dto.lat;
    country.lng = dto.lng;
    country.name = dto.name;
    country.native = dto.native;
    country.numericCode = dto.numericCode;
    country.phoneCode = dto.phoneCode;
    country.region = dto.region;
    country.subRegion = dto.subRegion;
    country.tld = dto.tld;
    country.timezones = dto.timezones;
    try {
      return await this.countryRepository.save(country, { reload: true });
    } catch (e) {
      throw new BadRequestException(`Could not save country ${dto.name}`);
    }
  }
}
