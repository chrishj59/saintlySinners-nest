import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';
import { ProductRestrictionEnum } from 'src/enums/product-restriction.enum';
import { RemoteFilesService } from 'src/remote-files/remote-files.service';
import { Repository } from 'typeorm';

import { CommonService } from '../common/common.service';
import { EDC_PRODUCT_FILE } from '../remote-files/entity/productFile.entity';
import { EdcProductNewDto } from './dtos/add-product.dto';
import { EdcOrderDto } from './dtos/edc-order.dto';
import { EDC_BATTERY } from './entities/edc-battery';
import { EDC_BRAND } from './entities/edc-brand';
import { EDC_NEW_CATEGORY } from './entities/edc-new-category.entity';
import { EDC_PRODUCT } from './entities/edc-product';
import { EDC_PRODUCT_BULLET } from './entities/edc-product-bullet-point.entity';
import { EDC_PRODUCT_RESTRICTION } from './entities/edc-product-restrictions.entity';
import { EDC_PROP_VALUE } from './entities/edc-prop-value';
import { EDC_PROPERTY } from './entities/edc-property';
import { EDC_VARIANT } from './entities/edc-variant';
import { EdcOrderInterface } from './interfaces/edc-order.interface';

interface ProductImage {
  image: Blob;
}
@Injectable()
export class EdcService {
  constructor(
    @InjectRepository(EDC_PRODUCT)
    private productRepository: Repository<EDC_PRODUCT>,
    @InjectRepository(EDC_BRAND)
    private brandRepository: Repository<EDC_BRAND>,
    @InjectRepository(EDC_VARIANT)
    private variantRepository: Repository<EDC_VARIANT>,
    @InjectRepository(EDC_PROPERTY)
    private propRepository: Repository<EDC_PROPERTY>,
    @InjectRepository(EDC_PROP_VALUE)
    private propValueRepository: Repository<EDC_PROP_VALUE>,
    @InjectRepository(EDC_PRODUCT_BULLET)
    private bulletpointRepository: Repository<EDC_PRODUCT_BULLET>,
    @InjectRepository(EDC_PRODUCT_RESTRICTION)
    private restrictionRepository: Repository<EDC_PRODUCT_RESTRICTION>,
    @InjectRepository(EDC_NEW_CATEGORY)
    private newCatRepository: Repository<EDC_NEW_CATEGORY>,
    @InjectRepository(EDC_PRODUCT_FILE)
    private productFileRepository: Repository<EDC_PRODUCT_FILE>,
    @InjectRepository(EDC_BATTERY)
    private batteryRepository: Repository<EDC_BATTERY>,

    private readonly filesService: RemoteFilesService,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly commonService: CommonService,
  ) {}
  logger = new Logger('EdcService');

  public async getProductIds(): Promise<EDC_PRODUCT[]> {
    const ids = this.productRepository.find({ select: ['id'] });
    return ids;
  }
  public async getProducts(): Promise<EDC_PRODUCT[]> {
    let products: EDC_PRODUCT[];
    try {
      const query = this.productRepository.createQueryBuilder('edc_product');
      products = await query
        .leftJoinAndSelect('edc_product.images', 'images')
        .leftJoinAndSelect('edc_product.variants', 'variants')
        .leftJoinAndSelect('edc_product.defaultCategory', 'defaultCategory')
        .leftJoinAndSelect('edc_product.newCategories', 'newCategories')
        .leftJoinAndSelect('edc_product.restrictions', 'restrictions')
        .leftJoinAndSelect('edc_product.properties', 'properties')
        .leftJoinAndSelect('properties.values', 'prop-values')
        .leftJoinAndSelect('edc_product.brand', 'brand')
        .leftJoinAndSelect('edc_product.bullets', 'bullets')
        .leftJoinAndSelect('edc_product.price', 'price')
        .leftJoinAndSelect('edc_product.batteryInfo', 'batteryInfo')
        // .andWhere('edc_product.id = :prodId', { prodId: id })
        .getMany();
    } catch (e) {
      this.logger.error(`Error loading single products`);
      this.logger.error(JSON.stringify(e));
      throw new BadRequestException(`Could not load product wi`);
    }
    return products;
  }

  public async getProductSingle(id: number): Promise<EDC_PRODUCT> {
    //const { id } = dto;

    const query = this.productRepository.createQueryBuilder('edc_product');
    let product: EDC_PRODUCT;
    try {
      product = await query
        .leftJoinAndSelect('edc_product.images', 'images')
        .leftJoinAndSelect('edc_product.variants', 'variants')
        .leftJoinAndSelect('edc_product.defaultCategory', 'defaultCategory')
        .leftJoinAndSelect('edc_product.newCategories', 'newCategories')
        .leftJoinAndSelect('edc_product.restrictions', 'restrictions')
        .leftJoinAndSelect('edc_product.properties', 'properties')
        .leftJoinAndSelect('properties.values', 'prop-values')
        .leftJoinAndSelect('edc_product.brand', 'brand')
        .leftJoinAndSelect('edc_product.bullets', 'bullets')
        .leftJoinAndSelect('edc_product.price', 'price')
        .leftJoinAndSelect('edc_product.batteryInfo', 'batteryInfo')
        .andWhere('edc_product.id = :prodId', { prodId: id })
        .getOne();
    } catch (e) {
      this.logger.error(`Error loading single product for id ${id}`);
      this.logger.error(JSON.stringify(e));
      throw new BadRequestException(`Could not load product wi`);
    }

    if (product) {
      return product;
    } else {
      throw new BadRequestException(`No product with id ${id}`);
    }
    return null; //`Get Product single with ${dto.id} `;
  }

  public async saveProduct(dto: EdcProductNewDto) {
    const id = Number(dto.id[0]);
    const artnr = dto.artnr[0];
    const title = dto.title[0];
    const description = dto.description[0];
    const casecount = Number(dto.casecount[0]);
    this.logger.log('Start of saveProduct with dto');

    const [day, month, year] = dto.date[0].split('-');

    const date = new Date(+year, +month - 1, +day);
    const [dayModify, monthModify, yearModify] = dto.modifydate[0].split('-');
    const modifydate = new Date(
      +yearModify,
      Number(monthModify) - 1,
      +dayModify,
    );
    let brand = null;
    if (dto.brand[0]) {
      const brandId = dto.brand[0]['id'][0];

      brand = await this.brandRepository.findOne({
        where: {
          id: Number(brandId),
        },
      });
      if (!brand) {
        let brandTemp = new EDC_BRAND();
        brandTemp.id = Number(brandId);
        brandTemp.title = dto.brand[0]['title'][0];
        brand = await this.brandRepository.save(brandTemp, {
          reload: true,
        });
      }
    }
    /*************
     * Variants element
     */
    let variants: EDC_VARIANT[] = [];
    if (dto.variants) {
      const variantArray = dto.variants[0]['variant'];

      for (const el of variantArray) {
        const variantId = Number(el['id']);
        let variantDB = await this.variantRepository.findOne({
          where: { id: variantId },
        });
        if (!variantDB) {
          variantDB = new EDC_VARIANT();
          variantDB.id = Number(el['id']);

          variantDB.type = el['type'][0] && el['type'][0];
          variantDB.subArtNr = el['subartnr'] && el['subartnr'][0];
          variantDB.ean = Number(el['ean']);
          variantDB.inStock = el['stock'] && el['stock'][0];
          variantDB.stockEstimate = Number(el['stockestimate']);
          variantDB.sizeTitle = el['title'] && el['title'][0];

          const variantSaved = await this.variantRepository.save(variantDB, {
            reload: true,
          });

          variants.push(variantSaved);
        }
        variants.push(variantDB);
      }
    }

    /*********
     * Properties
     */

    let properties: EDC_PROPERTY[] = [];
    if (dto.properties) {
      const propsArray = dto.properties[0]['prop'];
      for (const prop of propsArray) {
        const propId = prop['propid'][0];
        let propDB = await this.propRepository.findOne({
          where: { propertyId: propId, productId: id },
        });

        if (!propDB) {
          propDB = new EDC_PROPERTY();
          propDB.propertyId = propId;
          propDB.productId = id;
          propDB.propTitle = prop['property'][0];
          //propDB.values;
          console.log('propDB');
          console.log(propDB);
          propDB = await this.propRepository.save(propDB, { reload: true });
        }
        /**
         * check to see if values need updating
         */
        let valuesArray: EDC_PROP_VALUE[] = [];
        console.log('properties values');
        for (const val of prop['values'][0]['value']) {
          let valId = Number(val['id']); //
          if (isNaN(valId)) {
            valId = propId;
          }

          let valueDB: EDC_PROP_VALUE | null =
            await this.propValueRepository.findOne({ where: { id: valId } });
          if (!valueDB) {
            valueDB = new EDC_PROP_VALUE();
            valueDB.id = valId;
            valueDB.title = (val['title'] && val['title'][0]) || '';
            valueDB.unit = (val['unit'] && val['unit'][0]) || '';
            valueDB.magnitude = val['magnitude'] && val['magnitude'][0];

            valueDB = await this.propValueRepository.save(valueDB, {
              reload: true,
            });
          }
          valuesArray.push(valueDB);
        }
        propDB.values = valuesArray;
        propDB = await this.propRepository.save(propDB, { reload: true });
        properties.push(propDB);
      }
    }

    /**
     * Bullet points
     */

    let bulletPoints: EDC_PRODUCT_BULLET[] = [];
    if (dto.bulletpoints) {
      let seq = 0;
      for (const bp of dto.bulletpoints[0]['bp']) {
        seq++;
        const title = bp;
        let bullet = await this.bulletpointRepository.findOne({
          where: { description: title },
        });
        if (!bullet) {
          bullet = new EDC_PRODUCT_BULLET();
          bullet.seq = seq;
          bullet.description = title;
          bullet = await this.bulletpointRepository.save(bullet, {
            reload: true,
          });
        }
        bulletPoints.push(bullet);
      }
    }

    /**
     * Rstrictions
     */

    let restrictions: EDC_PRODUCT_RESTRICTION[] = [];
    if (dto.restrictions) {
      let germany: EDC_PRODUCT_RESTRICTION;
      if (dto.restrictions[0]['germany']) {
        const restriction = Boolean(dto.restrictions[0]['germany'][0] === 'Y');
        germany = await this.restrictionRepository.findOne({
          where: {
            restriction: ProductRestrictionEnum.Germany,
            restricted: restriction,
          },
        });
        if (!germany) {
          germany = new EDC_PRODUCT_RESTRICTION();
          germany.restriction = ProductRestrictionEnum.Germany;
          germany.restricted = restriction;
          germany = await this.restrictionRepository.save(germany, {
            reload: true,
          });
        }
        restrictions.push(germany);
      }

      let platform: EDC_PRODUCT_RESTRICTION;
      if (dto.restrictions[0]['platform']) {
        const restriction = Boolean(dto.restrictions[0]['platform'][0] === 'Y');
        platform = await this.restrictionRepository.findOne({
          where: {
            restriction: ProductRestrictionEnum.Platform,
            restricted: restriction,
          },
        });
        if (!platform) {
          platform = new EDC_PRODUCT_RESTRICTION();
          platform.restriction = ProductRestrictionEnum.Platform;
          platform.restricted = restriction;
          platform = await this.restrictionRepository.save(platform, {
            reload: true,
          });
        }
        restrictions.push(platform);
      }
    }

    /** battery required */
    let batteryRequired = false;
    let batteryInfo: EDC_BATTERY | null;

    if (dto.battery) {
      if (dto.battery[1]) {
        batteryRequired = Boolean(dto.battery[1] === 'Y');
      }
      if (dto.battery[0]['required']) {
        batteryRequired =
          dto.battery && Boolean(dto.battery[0]['required'][0] === 'Y');
      } else if (dto.battery[0]['id']) {
        const batteryId = Number(dto.battery[0]['id'][0]);
        batteryInfo = await this.batteryRepository.findOne({
          where: { id: batteryId },
        });
        if (!batteryInfo) {
          batteryInfo = new EDC_BATTERY();
          batteryInfo.id = batteryId;
          batteryInfo.included = dto.battery[0]['included'][0];
          batteryInfo.quantity = dto.battery[0]['quantity'][0];
          batteryInfo = await this.batteryRepository.save(batteryInfo, {
            reload: true,
          });
        }
      }
    }

    /**
     * new Categories
     *
     */
    let newCats: EDC_NEW_CATEGORY[] = [];
    if (dto.new_categories) {
      for (const c of dto.new_categories[0]['category'][0]['cats']) {
        const catId = Number(c.id);
        let cat = await this.newCatRepository.findOne({ where: { id: catId } });
        if (!cat) {
          cat = new EDC_NEW_CATEGORY();
          cat.id = catId;
          cat.title = c.title;
          cat = await this.newCatRepository.save(cat, { reload: true });
        }
        newCats.push(cat);
      }
    }

    /**********
     * Save product
     */
    const prod = new EDC_PRODUCT();
    prod.id = id;
    prod.artnr = artnr;
    prod.title = title;
    prod.description = description;
    prod.caseCount = casecount;
    prod.date = date;
    prod.modifyDate = modifydate;
    prod.brand = brand;
    prod.currency = dto.price[0]['currency'] && dto.price[0]['currency'][0];
    prod.b2b = dto.price[0]['b2b'] && Number(dto.price[0]['b2b'][0]);
    prod.b2c = dto.price[0]['b2c'] && Number(dto.price[0]['b2c'][0]);
    prod.vatRateNl = dto.price[0]['vatnl'] && Number(dto.price[0]['vatnl'][0]);
    prod.vatRateDe = dto.price[0]['vatde'] && Number(dto.price[0]['vatde'][0]);
    prod.vatRateFr = dto.price[0]['vatfr'] && Number(dto.price[0]['vatfr'][0]);
    prod.vatRateUk = dto.price[0]['vatuk'] && Number(dto.price[0]['vatuk'][0]);
    prod.discount = dto.price[0]['discount'] && dto.price[0]['discount'][0];
    prod.minPrice =
      dto.price[0]['minprice'] && Number(dto.price[0]['minprice'][0]);
    prod.weight =
      dto.measures[0]['weight'] && Number(dto.measures[0]['weight'][0]);
    prod.packaging =
      dto.measures[0]['packing'] && dto.measures[0]['packing'][0];
    this.logger.log('variants to assign to product');
    this.logger.log(JSON.stringify(variants));
    prod.variants = variants;
    prod.properties = properties;
    prod.material = dto.material && dto.material[0];
    prod.popularity = dto.popularity && Number(dto.popularity[0]);
    prod.countryCode = dto.country && dto.country[0];
    prod.bullets = bulletPoints;
    console.log('restrictions start');
    prod.restrictions = restrictions;
    console.log('restrictions end');
    prod.hsCode = dto.hscode && dto.hscode[0];
    prod.batteryRequired = batteryRequired;
    prod.newCategories = newCats;
    prod.batteryInfo = batteryInfo;
    console.log('before save product');
    const updatedProd = await this.productRepository.save(prod, {
      reload: true,
    });
    console.log('after save product');

    /*******
     * files
     *
     */
    console.log('start of files');
    let picsArray: string[] = [];

    if (dto.pics) {
      picsArray = dto.pics[0]['pic'];
      for (const url of dto.pics[0]['pic']) {
        const imageKey = url.substring(8, url.length).replaceAll('/', '_');
        console.log(`imageKey: ${imageKey}`);

        let prodFile = await this.productFileRepository.findOne({
          where: { key: imageKey },
        });

        if (!prodFile) {
          // no prod file so need to create

          let picFile = await this.httpService.axiosRef.get(url, {
            responseType: 'arraybuffer',
          });
          let picFileBuff = Buffer.from(picFile.data, 'binary');

          // const buff = Buffer.from(picFile.data.image);
          const newFile = await this.filesService.uploadProductFile(
            picFileBuff,
            prod.id,
            // url,
            imageKey,
          );
        }
      }
    }

    return {
      status: MessageStatusEnum.SUCCESS,
      message: `created ${updatedProd} products`,
    };
  }

  async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
    return this.filesService.uploadProductFile(imageBuffer, userId, filename);
  }

  async saveOrder(dto: EdcOrderDto): Promise<ResponseMessageDto> {
    // const country: Country = await this.commonService.getEdcCountry(
    //   dto.country,
    // );

    // const orderDto: CustomerOrderDto = {
    //   orderDate: new Date(),
    //   name: dto.name,
    //   houseNUmber: dto.house_nr,
    //   street: dto.street,
    //   town: dto.city,
    //   county: dto.county,
    //   countryEdc: dto.country,
    //   countryId: country.id,
    // };
    // const customerOrder = await this.customerOrderService.saveOrder(orderDto);

    const edcEmail = this.configService.get('EDC_ACCOUNT_EMAIL');
    const edcApiKey = this.configService.get('EDC_ACCOUNT_API_KEY');
    const order: EdcOrderInterface = {
      orderdetails: {
        customerdetails: {
          email: edcEmail,
          apikey: edcApiKey,
          output: 'advanced',
        },
        receiver: {
          name: dto.name,
          street: dto.street,
          postalcode: dto.postalcode,
          house_nr: dto.house_nr,
          city: dto.city,
          country: dto.country,
          phone: dto.phone,
          own_ordernumber: dto.own_ordernumber,
          consumer_amount: dto.consumer_amount,
          consumer_amount_currency: dto.consumer_amount_currency,
          attachment: dto.attachment,
        },
        products: dto.products,
      },
    };

    const xml2js = require('xml2js');
    const builder = new xml2js.Builder({
      explicitArray: true,
      mergeAttrs: true,
    });
    const xmlOutput = builder.buildObject(order);
    const url = require('url');
    const params = new url.URLSearchParams({
      data: xmlOutput,
    });
    const { data } = await firstValueFrom(
      this.httpService.post(process.env.EDC_ORDER_URL, params.toString()).pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error.response.data);
          throw 'An error happened!';
        }),
      ),
    );

    return {
      status: MessageStatusEnum.SUCCESS,
      message: `save order edc service  xml ${data.result}`,
    };
  }
}
