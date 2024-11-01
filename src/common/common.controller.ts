import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';

import { ResponseMessageDto } from '../dtos/response-message-dto';
import FindOneStringParams, {
  FindOneNumberParams,
} from '../utils/findOneParamString';
import { CommonService } from './common.service';
import { CountryDto } from './dtos/country.dto';
import { CourierDto } from './dtos/courier.dto';
import { DeliveryChargeDto } from './dtos/deliveryCharge.dto';
import { Country } from './entity/country.entity';
import { DeliveryCourier } from './entity/delivery-courier.entity';
import { CountryUpdateDTO } from './dtos/country-update.dto';
import {
  DeliveryRemoteLocationDto,
  DeliveryRemoteLocationUpdateDto,
} from './dtos/delivery-remote-location.dto';
import daysToWeeks from 'date-fns/esm/daysToWeeks';
import { DELIVERY_REMOTE_LOCATION } from './entity/delivery-remote-location';

@Controller()
@UseInterceptors(ClassSerializerInterceptor)
export class CommonController {
  constructor(private readonly commonService: CommonService) {}

  logger = new Logger(`CommonController`);
  @Post('/countryLoad')
  public async loadCountry(@Body() dto: CountryDto): Promise<Country> {
    return this.commonService.addCountry(dto);
  }

  @Post('/courier')
  public async addDeliveryCourier(
    @Body() dto: CourierDto,
  ): Promise<DeliveryCourier> {
    return this.commonService.addDeliveryCourier(dto);
  }

  @Post('/deliveryCharge')
  public async addDeliveryCharge(@Body() dto: DeliveryChargeDto) {
    return this.commonService.addDeliveryCharge(dto);
  }

  @Post('/deliveryRemoteLocation')
  public async addDeliveryRemoteLocation(
    @Body() dto: DeliveryRemoteLocationDto,
  ): Promise<DELIVERY_REMOTE_LOCATION> {
    return this.commonService.addDeliveryRemoteLocation(dto);
  }

  @Put('/deliveryRemoteLocation')
  public async updateDeliveryRemoteLocation(
    @Body() dto: DeliveryRemoteLocationUpdateDto,
  ): Promise<DELIVERY_REMOTE_LOCATION> {
    return this.commonService.updateDeliveryRemoteLocation(dto);
  }

  @Delete('/deliveryRemoteLocation/:id')
  public async deleteDEliveryRemoteLocation(
    @Param() postCode: FindOneNumberParams,
  ): Promise<ResponseMessageDto> {
    return await this.commonService.deleteRemoteDeliveryCharge(postCode.id);
  }

  @Put('/deliveryCharge')
  public async updateDeliveryCharge(@Body() dto: DeliveryChargeDto) {
    return await this.commonService.updateDeliveyCharge(dto);
  }

  @Get('/deliveryCharge')
  public async allDeliveryCharges() {
    return this.commonService.allDeliveryCharges();
  }

  @Delete('/deliveryCharge/:id')
  public async deleteDeliveryCharge(
    @Param() idParam: FindOneStringParams,
  ): Promise<ResponseMessageDto> {
    return this.commonService.deleteCategory(idParam.id);
  }

  @Get('/countryName')
  public async getCountryNames(): Promise<Country[]> {
    return await this.commonService.getCountryNames();
  }

  @Get('/country')
  public async getCountryAll(): Promise<Country[]> {
    return await this.commonService.getCountries();
  }

  @Get('/country/edc')
  public async getCountryEdc(): Promise<Country[]> {
    return await this.commonService.getCountriesEdc();
  }

  @Get('/country/delivery')
  public async getCountryDelivery(): Promise<Country[]> {
    return await this.commonService.getCountriesDelivery();
  }

  @Put('/country')
  public async saveCountry(@Body() dto: CountryUpdateDTO): Promise<number> {
    return this.commonService.saveCountry(dto);
  }

  @Get('/courier')
  public async getCourier(): Promise<DeliveryCourier[]> {
    return await this.commonService.getCourier();
  }

  @Patch('/courier')
  public async updateCourier(@Body() dto: CourierDto): Promise<number> {
    return this.commonService.updateCourier(dto);
  }

  @Post('/courier')
  public async addCourier(@Body() dto: any): Promise<DeliveryCourier> {
    return this.commonService.addCourier(dto);
  }
}
