import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';
import { Repository } from 'typeorm';

import { ResponseMessageDto } from '../dtos/response-message-dto';
import { PRODUCT_VENDOR } from '../vendor/entity/vendor.entity';
import { CountryDto } from './dtos/country.dto';
import { CourierDto } from './dtos/courier.dto';
import { DeliveryChargeDto } from './dtos/deliveryCharge.dto';
import { Country } from './entity/country.entity';
import { DeliveryCharge } from './entity/delivery-charges.entity';
import { DeliveryCourier } from './entity/delivery-courier.entity';
import DeliveryChargeNotFoundException from './exceptions/deliveryChargeNotFound.exception';

@Injectable()
export class CommonService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
    @InjectRepository(DeliveryCourier)
    private courierRepository: Repository<DeliveryCourier>,
    @InjectRepository(PRODUCT_VENDOR)
    private vendorRepository: Repository<PRODUCT_VENDOR>,
    @InjectRepository(DeliveryCharge)
    private delChargeRepository: Repository<DeliveryCharge>,
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

  public async addDeliveryCourier(dto: CourierDto): Promise<DeliveryCourier> {
    const courier = new DeliveryCourier();
    courier.name = dto.name;
    const _courier = this.courierRepository.save(courier, { reload: true });
    return _courier;
  }

  public async addDeliveryCharge(
    dto: DeliveryChargeDto,
  ): Promise<DeliveryCharge> {
    const delCharge = new DeliveryCharge();
    delCharge.amount = dto.amount;
    const courier = await this.courierRepository.findOne({
      where: { id: dto.courierId },
    });

    const country = await this.countryRepository.findOne({
      where: { id: dto.countryId },
    });
    delCharge.country = country;
    delCharge.courier = courier;
    delCharge.maxWeight = dto.maxWeight;
    delCharge.minWeight = dto.minWeight;
    delCharge.uom = dto.uom;
    const vendor = await this.vendorRepository.findOne({
      where: { id: dto.vendorId },
    });
    delCharge.vendor = vendor;
    const _delCharge = this.delChargeRepository.save(delCharge, {
      reload: true,
    });
    return _delCharge;
  }

  public async allDeliveryCharges(): Promise<DeliveryCharge[]> {
    return await this.delChargeRepository.find({
      relations: ['vendor', 'country', 'courier'],
    });
  }

  public async updateDeliveyCharge(
    dto: DeliveryChargeDto,
  ): Promise<DeliveryCharge> {
    const deliveryCharge = await this.delChargeRepository.findOne({
      where: { id: dto.id },
    });
    deliveryCharge.amount = dto.amount;
    deliveryCharge.maxWeight = dto.maxWeight;
    deliveryCharge.minWeight = dto.minWeight;
    deliveryCharge.uom = dto.uom;

    const courier = await this.courierRepository.findOne({
      where: { id: dto.courierId },
    });

    const country = await this.countryRepository.findOne({
      where: { id: dto.countryId },
    });

    const vendor = await this.vendorRepository.findOne({
      where: { id: dto.vendorId },
    });

    deliveryCharge.courier = courier;
    deliveryCharge.country = country;
    deliveryCharge.vendor = vendor;
    return await this.delChargeRepository.save(deliveryCharge);
  }

  public async getCountryNames(): Promise<Country[]> {
    return await this.countryRepository.find({
      select: ['id', 'name', 'emoji'],
    });
  }

  public async getEdcCountry(edcCountryCode: number): Promise<Country> {
    return await this.countryRepository.findOne({
      where: { edcCountryCode },
    });
  }
  public async getCourier(): Promise<DeliveryCourier[]> {
    return await this.courierRepository.find();
  }

  async deleteCategory(id: string): Promise<ResponseMessageDto> {
    const deleteResponse = await this.delChargeRepository.softDelete(id);
    if (!deleteResponse.affected) {
      throw new DeliveryChargeNotFoundException(id);
    }

    return {
      status: MessageStatusEnum.SUCCESS,
      message: `Deleted ${deleteResponse.affected} delivery charges`,
    };
  }
}
