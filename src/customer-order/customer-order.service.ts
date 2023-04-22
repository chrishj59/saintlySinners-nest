import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Country } from 'src/common/entity/country.entity';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';
import { USER } from 'src/user/entity/user.entity';
import { PRODUCT_VENDOR } from 'src/vendor/entity/vendor.entity';
import { Repository } from 'typeorm';

import { EDC_PRODUCT } from '../edc/entities/edc-product';
import { CustomerOrderDto } from './dtos/customerOrder.dto';
import { CUSTOMER_ORDER } from './entities/customerOrder.entity';
import { CUSTOMER_ORDER_LINE } from './entities/customerOrderLine.entity';

type prodLine = {
  artnr: string;
};
@Injectable()
export class CustomerOrderService {
  constructor(
    @InjectRepository(PRODUCT_VENDOR)
    private vendorRepository: Repository<PRODUCT_VENDOR>,
    @InjectRepository(EDC_PRODUCT)
    private prodRepo: Repository<EDC_PRODUCT>,
    @InjectRepository(Country)
    private countryRepo: Repository<Country>,
    @InjectRepository(USER)
    private userRepo: Repository<USER>,
    @InjectRepository(CUSTOMER_ORDER)
    private custRepo: Repository<CUSTOMER_ORDER>,
  ) {}

  logger = new Logger('CustomerOrderService');

  async saveOrder(dto: CustomerOrderDto): Promise<ResponseMessageDto> {
    this.logger.log(`dto is : ${JSON.stringify(dto)}`);
    const vend = await this.vendorRepository.findOne({
      where: { id: dto.vendorNumber },
    });

    const prods = await this.prodRepo
      .createQueryBuilder('edc_product')
      .where('edc_product.artnr IN (:...artnr)', { artnr: dto.products })
      .getMany();

    let country: Country;
    let customer: USER;
    if (dto.oneTimeCustomer) {
      country = await this.countryRepo.findOne({
        where: {
          edcCountryCode: dto.customer.country,
        },
      });

      customer = await this.userRepo.findOne({
        where: {
          id: dto.customerId,
        },
      });
    }

    const orderLines: CUSTOMER_ORDER_LINE[] = [];
    if (prods) {
      prods.map((prod: EDC_PRODUCT) => {
        console.log(`orderLines : ${orderLines.length}`);

        const foundLine = orderLines.find(
          (el: CUSTOMER_ORDER_LINE) => el.edcProduct.artnr === prod.artnr,
        );

        if (foundLine === undefined) {
          console.log('new order line');
          const line: CUSTOMER_ORDER_LINE = new CUSTOMER_ORDER_LINE();
          line.quantity = 1;
          line.edcProduct = prod;
          line.amount = prod.b2c.toString();

          orderLines.push(line);
        } else {
          console.log('append order line');
          const index = orderLines.findIndex(
            (el: CUSTOMER_ORDER_LINE) => el.edcProduct.artnr === prod.artnr,
          );
          let amount = parseFloat(foundLine.amount);
          amount = prod.b2c;
          foundLine.amount = amount.toString();
          foundLine.quantity = foundLine.quantity + 1;
          orderLines[index] = foundLine;
        }
      });
    }
    this.logger.log(`orderlines size ${JSON.stringify(orderLines.length)}`);
    const custOrder = new CUSTOMER_ORDER();
    custOrder.vendor = vend;
    custOrder.lines = orderLines;
    custOrder.stripeSession = dto.stripeSessionId;
    custOrder.oneTimeCustomer = dto.oneTimeCustomer;
    custOrder.goodsValue = dto.goodsValue;
    custOrder.tax = dto.tax;
    custOrder.total = dto.total;
    custOrder.currencyCode = dto.currencyCode;
    if (dto.oneTimeCustomer) {
      custOrder.customerTitle = dto.customer.customerTitle;
      custOrder.name = dto.customer.name;
      custOrder.houseNumber = dto.customer.houseNumber;
      custOrder.houseName = dto.customer.houseName;
      custOrder.street = dto.customer.street;
      custOrder.city = dto.customer.city;
      custOrder.county = dto.customer.county;
      custOrder.postCode = dto.customer.postCode;
      custOrder.zip = dto.customer.zip;
      custOrder.telphone = dto.customer.telphone;
      custOrder.country = country;
    } else {
      custOrder.customer = customer;
    }
    const custOrderUpdated = await this.custRepo.save(custOrder, {
      reload: true,
    });
    if (custOrderUpdated) {
      return {
        status: MessageStatusEnum.SUCCESS,
        message: custOrderUpdated.id,
      };
    } else {
      return {
        status: MessageStatusEnum.ERROR,
        message: `Could not save customer order`,
      };
    }
  }
}
