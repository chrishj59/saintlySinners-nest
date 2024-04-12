import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { ILike, In, MoreThan, Repository } from 'typeorm';
import { XtrCategoryDto } from './dtos/xtr-category.dto';
import { FindOneNumberParams } from 'src/utils/findOneParamString';
import { RemoteFilesService } from 'src/remote-files/remote-files.service';
import { PUBLIC_FILE } from 'src/remote-files/entity/publicFile.entity';

import { HttpService } from '@nestjs/axios';
import { Attribute, Ean, XtrProductDto } from './dtos/xtr-product.dto';
import { XTR_PRODUCT } from './entity/xtr-product.entity';
import { XTR_BRAND } from './entity/xtr-brand.entity';
import { XTR_PROD_ATTRIBUTE } from './entity/xtr-prod-attribute.entity';
import { XTR_ATTRIBUTE_VALUE } from './entity/xtr-attribute-value.entity';
import { XTR_PROD_ATTRIBUTE_EAN } from './entity/xtr-prod-attribute-ean.entity';
import { XtrProductFilterDto } from './dtos/xtr-prod-filter.dto';
import { XtrBrandNewDto } from './dtos/xtr-brand-new.dto';
import { XtrBrandDto } from './dtos/xtr-brand.dto';
import {
  StockSize,
  XtraderStockItem,
  XtraderStockLevel,
  xtrStockLevelUpdateResp,
  xtraderStockLevelDto,
} from './dtos/xtr-stock-level.dto';
import { XtrProdStockStatusEnum } from './enum/xtrProd-status.enum';
import { Item } from 'src/items/entity/item.entity';

@Injectable()
export class XtraderService {
  constructor(
    @InjectRepository(XTR_CATEGORY)
    private catRepo: Repository<XTR_CATEGORY>,
    @InjectRepository(XTR_BRAND)
    private brandRepo: Repository<XTR_BRAND>,
    @InjectRepository(XTR_PRODUCT)
    private prodRepo: Repository<XTR_PRODUCT>,
    @InjectRepository(XTR_PROD_ATTRIBUTE)
    private attrRep: Repository<XTR_PROD_ATTRIBUTE>,
    @InjectRepository(XTR_ATTRIBUTE_VALUE)
    private attrValueRepo: Repository<XTR_ATTRIBUTE_VALUE>,
    @InjectRepository(XTR_PROD_ATTRIBUTE_EAN)
    private prodEanRepo: Repository<XTR_PROD_ATTRIBUTE_EAN>,
    private readonly filesService: RemoteFilesService,
    private readonly httpService: HttpService,
  ) {}
  private logger = new Logger('XtraderService');

  public async updateBrand(dto: XtrBrandDto): Promise<XTR_BRAND> {
    let brand = await this.brandRepo.findOne({ where: { id: dto.id } });
    if (!brand) {
      throw new BadRequestException(`No brand with id: ${dto.id}`);
    }
    brand.imageName = dto.imageName;
    brand.name = dto.name;
    brand.isFavourite = dto.isFavourite;
    brand.ranking = dto.ranking;
    const imageFile = await this.filesService.updateXtrBrandFile(
      dto.id,
      dto.imageKey,
    );
    brand.image = imageFile;

    const _brand = await this.brandRepo.save(brand, { reload: true });
    return _brand;
  }

  public async getHomePageBrands(): Promise<XTR_BRAND[]> {
    const brands = await this.brandRepo.find({
      where: {
        isFavourite: true,
        ranking: MoreThan(0),
      },
    });
    if (!brands) {
      throw new BadRequestException('No Brands on menu');
    } else {
      return brands;
    }
  }
  public async newCategory(dto: XtrCategoryDto): Promise<XTR_CATEGORY> {
    // is does the parent exist
    let cat: XTR_CATEGORY;
    try {
      cat = await this.catRepo.findOne({ where: { id: dto.id } });

      if (!cat) {
        cat = new XTR_CATEGORY();
        cat.id = dto.id;
      }

      const parent = await this.catRepo.findOne({
        where: { id: dto.parentId },
      });
      if (parent) {
        cat.parentCategory = parent;
      }
      cat.catName = dto.name;
      cat = await this.catRepo.save(cat, { reload: true });
    } catch (err) {
      this.logger.error(`err ${JSON.stringify(err, null, 2)}`);
      throw new BadRequestException(
        `Could not create new XTRADER category with ${JSON.stringify(dto)}`,
      );
    }
    if (dto.category_image) {
      const imgUrl = `${process.env.XTRADER_IMG_URL}${dto.category_image}`;

      let imgFileBuff: Buffer;
      try {
        let imgFile = await this.httpService.axiosRef.get(imgUrl, {
          responseType: 'arraybuffer',
        });

        if (imgFile.data) {
          imgFileBuff = Buffer.from(imgFile.data, 'binary');
          const catRemoteFile = await this.filesService.uploadXtrCategoryFile(
            imgFileBuff,
            cat.id,
            dto.category_image,
          );
          cat.image = catRemoteFile;
          cat = await this.catRepo.save(cat, { reload: true });
        }
      } catch (err) {
        this.logger.warn(`category Could not find image for ${cat.catName}`);
      }
    }

    return cat;
  }

  public async getAllBrands(): Promise<XTR_BRAND[]> {
    try {
      const brands = await this.brandRepo.find();
      return brands;
    } catch (err) {
      this.logger.warn('Error finding brands');
      throw new BadRequestException(
        `Error getting brands ${JSON.stringify(err, null, 2)}`,
      );
    }
  }
  public async getOneCategory(id: string): Promise<XTR_CATEGORY> {
    const _id = parseInt(id);
    try {
      const cat = await this.catRepo.findOne({ where: { id: _id } });

      return cat;
    } catch (err) {
      console.log(`Error getting one category ${JSON.stringify(err, null, 2)}`);
      throw new BadRequestException(
        `Error getting one category ${JSON.stringify(err, null, 2)}`,
      );
    }
  }

  public async getBrand(name: string): Promise<XTR_BRAND | null> {
    return this.brandRepo.findOne({ where: { name } });
  }

  public async getCategoryByName(
    catName: string,
  ): Promise<XTR_CATEGORY | null> {
    return this.catRepo.findOne({ where: { catName } });
  }

  async newProduct(dto: XtrProductDto) {
    const prod = new XTR_PRODUCT();
    prod.id = dto.id;
    prod.weight = parseFloat(dto.weight);
    prod.name = dto.name;
    prod.model = dto.model;
    prod.goodsPrice = parseFloat(dto.goodsPrice);
    prod.privateStockPrice = parseFloat(dto.privateStockPrice);
    prod.caseSize = dto.caseSize;
    prod.retailPrice = parseFloat(dto.retailPrice);
    prod.description = dto.description;
    prod.descriptionHtml = dto.descriptionHtml;
    prod.ean = dto.ean;
    prod.length = dto.length;
    prod.lubeType = dto.lubeType;
    prod.condomSafe = dto.condomSafe;
    prod.forWho = dto.forWho;
    prod.liquidVolume = dto.liquidVolume;
    prod.washing = dto.washing;
    prod.insertable = dto.insertable;
    prod.diameter = dto.diameter;

    prod.originCircum = dto.originCircum;
    prod.originDiam = dto.originDiam;
    prod.circumference = dto.circumference;
    prod.colour = dto.colour;
    prod.flexbility = dto.flexbility;
    prod.controller = dto.controller;
    prod.whatIsIt = dto.whatIsIt;
    prod.for = dto.for;
    prod.motion = dto.motion;
    prod.misc = dto.misc;
    prod.waterproof = dto.waterproof;
    prod.material = dto.material;
    prod.style = dto.style;
    prod.washing = dto.washing;

    // prod.feature = dto.feature
    console.log(
      `prod.retailPrice ${prod.retailPrice} dto.retailPrice ${prod.retailPrice}`,
    );
    const cat = await this.getCategoryByName(dto.catName);
    prod.category = cat;

    let brand = await this.getBrand(dto.brand);
    if (!brand) {
      const _brand = new XTR_BRAND();
      _brand.name = dto.brand;
      const _brandDB = await this.brandRepo.save(_brand, { reload: true });
      brand = _brandDB;
    }
    prod.brand = brand;

    /** load images for product if in DTO */
    if (dto.thumb) {
      let thumb = await this.filesService.getXtrProdImage(dto.thumb);
      console.log(`does thumb already exist ${JSON.stringify(thumb, null, 2)}`);
      if (!thumb) {
        thumb = await this.filesService.uploadXtrStockFile(
          dto.thumb,
          'thumb',
          prod.id,
        );
      }

      prod.thumb = thumb;
    }
    let _prod = await this.prodRepo.save(prod, { reload: true });
    if (dto.attribute) {
      let attribute = new XTR_PROD_ATTRIBUTE();
      attribute.attributeId = dto.attribute.id;
      attribute.name = dto.attribute.name;
      attribute.product = _prod;
      attribute = await this.attrRep.save(attribute, { reload: true });

      const attrValuesArray: XTR_ATTRIBUTE_VALUE[] = [];
      const attrValues = dto.attribute.attributeValues;

      for (const attrVal of attrValues) {
        this.logger.warn(
          `attrVal at start of loop ${JSON.stringify(attrVal, null, 2)}`,
        );
        let _attrValue = await this.attrValueRepo.findOne({
          where: { id: attrVal.value },
        });
        this.logger.warn(`_attrValue ${JSON.stringify(_attrValue, null, 2)}`);
        if (!_attrValue) {
          _attrValue = new XTR_ATTRIBUTE_VALUE();
          _attrValue.id = attrVal.value;

          _attrValue.title = attrVal.title ? attrVal.title : ' ';
          _attrValue.priceAdjustment = parseFloat(attrVal.priceAdjust);
          const attrValueDB = await this.attrValueRepo.save(_attrValue, {
            reload: true,
          });
        }

        attrValuesArray.push(_attrValue);
      }

      attribute.attributeValues = attrValuesArray;
      attribute = await this.attrRep.save(attribute, { reload: true });
    }

    if (dto.eans) {
      const eanArray: XTR_PROD_ATTRIBUTE_EAN[] = [];
      for (const ean of dto.eans) {
        const _ean = new XTR_PROD_ATTRIBUTE_EAN();
        _ean.code = ean.ean;
        _ean.value = ean.value;
        _ean.product = prod;
        this.prodEanRepo.save(_ean, { reload: true });
        const _eanDB = await this.logger.warn(
          `_ean is ${JSON.stringify(_ean, null, 2)}`,
        );
        // let eanDB = await this.prodEanRepo.findOne({
        //   where: { code: _ean.code },
        // });
        // if (!eanDB) {
        //   eanDB = await this.prodEanRepo.save(_ean, { reload: true });
        // }
        // eanArray.push(eanDB);
      }
      // this.logger.warn(`ean list is ${JSON.stringify(eanArray, null, 2)}`);
      // prod.eans = eanArray;
    }

    console.log(`dto.ximage ${JSON.stringify(dto.ximage, null, 2)}`);
    if (dto.ximage) {
      let ximage = await this.filesService.getXtrProdImage(dto.ximage);

      if (!ximage) {
        ximage = await this.filesService.uploadXtrStockFile(
          dto.ximage,
          'ximage',
          prod.id,
        );
      }
      prod.ximage = ximage;
    }

    if (dto.ximage2) {
      let ximage2 = await this.filesService.getXtrProdImage(dto.ximage2);
      if (!ximage2) {
        ximage2 = await this.filesService.uploadXtrStockFile(
          dto.ximage2,
          'ximage2',
          prod.id,
        );
      }
      prod.ximage2;
    }
    if (dto.ximage3) {
      const ximage3 = await this.filesService.getXtrProdImage(dto.ximage3);
      if (!ximage3) {
        await this.filesService.uploadXtrStockFile(
          dto.ximage3,
          'ximage3',
          prod.id,
        );
      }
    }
    if (dto.ximage4) {
      const ximage4 = await this.filesService.getXtrProdImage(dto.ximage4);
      if (!ximage4) {
        await this.filesService.uploadXtrStockFile(
          dto.ximage4,
          'ximage4',
          prod.id,
        );
      }
    }
    if (dto.ximage5) {
      const ximage5 = await this.filesService.getXtrProdImage(dto.ximage5);
      if (!ximage5) {
        await this.filesService.uploadXtrStockFile(
          dto.ximage5,
          'ximage4',
          prod.id,
        );
      }
    }

    if (dto.multi1) {
      const multi1 = await this.filesService.getXtrProdImage(dto.multi1);
      if (!multi1) {
        await this.filesService.uploadXtrStockFile(
          dto.multi1,
          'multi1',
          prod.id,
        );
      }
    }
    if (dto.multi2) {
      const multi2 = await this.filesService.getXtrProdImage(dto.multi2);
      if (!multi2) {
        await this.filesService.uploadXtrStockFile(
          dto.multi2,
          'multi2',
          prod.id,
        );
      }
    }

    if (dto.multi3) {
      const multi3 = await this.filesService.getXtrProdImage(dto.multi3);
      if (!multi3) {
        await this.filesService.uploadXtrStockFile(
          dto.multi3,
          'multi3',
          prod.id,
        );
      }
    }
    if (dto.bigmulti1) {
      const bigmulti1 = await this.filesService.getXtrProdImage(dto.bigmulti1);
      if (!bigmulti1) {
        await this.filesService.uploadXtrStockFile(
          dto.bigmulti1,
          'bigmulti1',
          prod.id,
        );
      }
    }
    if (dto.bigmulti2) {
      let bigmulti2 = await this.filesService.getXtrProdImage(dto.bigmulti2);
      if (!bigmulti2) {
        bigmulti2 = await this.filesService.uploadXtrStockFile(
          dto.bigmulti2,
          'bigmulti2',
          prod.id,
        );
      }
      prod.bigmulti2 = bigmulti2;
    }

    if (dto.bigmulti3) {
      let bigmulti3 = await this.filesService.getXtrProdImage(dto.bigmulti3);
      if (!bigmulti3) {
        bigmulti3 = await this.filesService.uploadXtrStockFile(
          dto.bigmulti3,
          'bigmulti3',
          prod.id,
        );
      }
      prod.bigmulti3 = bigmulti3;
    }
    _prod = await this.prodRepo.save(prod, { reload: true });
    return _prod;
  }

  public async getProduct(id: number): Promise<XTR_PRODUCT> {
    const prod = await this.prodRepo.findOne({
      relations: [
        'thumb',
        'ximage',
        'ximage2',
        'ximage3',
        'ximage4',
        'ximage5',
        'multi1',
        'multi2',
        'multi3',
        'bigmulti1',
        'bigmulti2',
        'bigmulti3',
        'feature',
        'brand',
        'attributes',
        'attributes.attributeValues',
        'category',
        'eans',
      ],
      where: { id },
    });

    return prod;
  }
  public async getProductIds(): Promise<number[]> {
    const prods = await this.prodRepo.find({
      select: {
        id: true,
      },
    });

    let ids: number[] = [];
    for (const p of prods) {
      if (p.id) {
        ids.push(p.id);
      }
    }
    return ids;
  }

  public async getProductsFiltered(
    filterValue: XtrProductFilterDto,
  ): Promise<XTR_PRODUCT[]> {
    const title = filterValue.searchParam;
    try {
      const products = await this.prodRepo.find({
        where: [
          {
            name: ILike(`%${title}%`),
          },
          {
            description: ILike(`%${title}%`),
          },
        ],

        relations: [
          'thumb',
          'ximage',
          'ximage2',
          'ximage3',
          'ximage4',
          'ximage5',
          'multi1',
          'multi2',
          'multi3',
          'bigmulti1',
          'bigmulti2',
          'bigmulti3',
          'feature',
          'brand',
          'attributes',
          'atrributes.attributeValues',
          'category',
          'eans',
        ],
      });

      return products;
    } catch (err) {
      this.logger.warn('Error getting products');
      throw new BadRequestException('Error getting products');
    }
  }

  public async updateStockLevel(
    dto: XtraderStockLevel,
  ): Promise<xtrStockLevelUpdateResp> {
    this.logger.log(
      `updateStockLevel called with dto ${JSON.stringify(dto, null, 2)}`,
    );

    const prods: XtraderStockItem[] = dto.products;
    this.logger.log(`Number of products ${prods.length ? prods.length : 0}`);
    const inStockItems: string[] = [];
    const noStockItems: string[] = [];
    const stockSizes: string[] = [];

    let instockNum = 0;
    let noStockNum = 0;
    let stockSizeNum = 0;
    let noStockSizeNum = 0;
    prods.forEach((p: XtraderStockItem) => {
      if (p.stockItem) {
        if (p.stockItem.level === 'In Stock') {
          this.logger.log('In Stock item');
          inStockItems.push(p.item);
        } else if (p.stockItem.level === 'No Stock.') {
          this.logger.log('No Stock item');
          noStockItems.push(p.item);
        }
      } else {
        this.logger.log('Stock sizes item');
        this.logger.log(`sizes prod ${JSON.stringify(p, null, 2)}`);
        const item = p.item;
        this.logger.log(`sizes item ${item}`);
        //TODO: make sure item is a tring
        if (item) stockSizes.push(item);
        this.logger.log(`after found sizes rec ${stockSizes}`);
      }
    });

    this.logger.log(
      `InStockItems length ${inStockItems.length} noStockItems len ${noStockItems.length} stocksizes ${stockSizes.length} `,
    );
    if (inStockItems.length > 0) {
      // this.logger.log(`inStockItems ${stockSizes}`);
      let inStockRows = await this.prodRepo
        .createQueryBuilder('xtr-product')
        .update(XTR_PRODUCT)
        .set({ stockStatus: XtrProdStockStatusEnum.IN })
        .where({ model: In(inStockItems) })
        .execute();
      this.logger.log(`instock item array ${inStockItems}`);

      this.logger.log(`Result from instock update ${inStockRows.affected}`);
      instockNum = inStockRows.affected;
    }

    // update stock out
    if (noStockItems.length > 0) {
      const outStockRows = await this.prodRepo
        .createQueryBuilder('xtr-product')
        .update(XTR_PRODUCT)
        .set({ stockStatus: XtrProdStockStatusEnum.OUT })
        .where({ model: In(noStockItems) })
        .execute();

      noStockNum = outStockRows.affected;
    }
    if (stockSizes.length > 0) {
      this.logger.log(`to update stockSizes ${stockSizes.length}`);
      this.logger.log(`stockSizes ${stockSizes}`);
      const _stockSizes = await this.prodRepo
        .createQueryBuilder('xtr-product')
        .leftJoinAndSelect('xtr-product.attributes', 'attributes')

        .where({ model: In(stockSizes) })
        .getMany();

      this.logger.log(`_stockSizes ${JSON.stringify(_stockSizes, null, 2)}`);
    }
    // 'feature',
    //     'brand',
    //     'attributes',
    //     'attributes.attributeValues',
    //     'category'
    // use update where in
    const resp: xtrStockLevelUpdateResp = {
      inStock: instockNum,
      outOfStock: noStockNum,
    };
    return resp;
  }
}
