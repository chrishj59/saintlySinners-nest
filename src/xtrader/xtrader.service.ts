import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { Repository } from 'typeorm';
import { XtrCategoryDto } from './dtos/xtr-category.dto';
import { FindOneNumberParams } from 'src/utils/findOneParamString';
import { RemoteFilesService } from 'src/remote-files/remote-files.service';
import { PUBLIC_FILE } from 'src/remote-files/entity/publicFile.entity';

import { HttpService } from '@nestjs/axios';
import { Ean, XtrProductDto } from './dtos/xtr-product.dto';
import { XTR_PRODUCT } from './entity/xtr-product.entity';
import { XTR_BRAND } from './entity/xtr-brand.entity';
import { XTR_PROD_ATTRIBUTE } from './entity/xtr-prod-attribute.entity';
import { XTR_ATTRIBUTE_VALUE } from './entity/xtr-attribute-value.entity';
import { XTR_PROD_ATTRIBUTE_EAN } from './entity/xtr-prod-attribute-ean.entity';

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
        this.logger.warn(`Could not find image for ${cat.catName}`);
      }
    }

    return cat;
  }

  public async getOneCategory(id: string): Promise<XTR_CATEGORY> {
    const _id = parseInt(id);
    try {
      const cat = await this.catRepo.findOne({ where: { id: _id } });
      this.logger.log(`find cat returned ${cat}`);
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
    this.logger.log(`dto passed in ${JSON.stringify(dto, null, 2)}`);
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
    prod.liquidVolumeUom = dto.liquidVolumeUom;
    prod.washing = dto.washing;
    prod.insertableToy = dto.insertableToy;
    prod.diameter = dto.diameter;
    prod.diameterUom = dto.diameterUom;
    prod.originCircum = dto.originCircum;
    prod.originCircumUom = dto.originCircumUom;
    prod.originDiam = dto.originDiam;
    prod.originDiamUom = dto.originDiamUom;
    prod.circumference = parseFloat(dto.circumference);
    prod.circumferenceUom = dto.circumferenceUom;
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

    const cat = await this.getCategoryByName(dto.catName);
    prod.category = cat;

    let brand = await this.getBrand(dto.brand);
    this.logger.log(`get brand initially ${brand}`);
    if (!brand) {
      this.logger.log('save brand to DB');
      const _brand = new XTR_BRAND();
      _brand.name = dto.brand;
      const _brandDB = await this.brandRepo.save(_brand, { reload: true });
      brand = _brandDB;
      this.logger.log(`Brand saved ${JSON.stringify(_brandDB, null, 2)}`);
    }
    prod.brand = brand;
    let _prod = await this.prodRepo.save(prod, { reload: true });
    /** load images for product if in DTO */
    if (dto.thumb) {
      let thumb = await this.filesService.getXtrProdImage(dto.thumb);
      console.log(`does thumb already exist ${JSON.stringify(thumb, null, 2)}`);
      if (!thumb) {
        await this.filesService.uploadXtrStockFile(dto.thumb, 'thumb', prod.id);
        this.logger.log('after save thumb image');
      }
    }

    if (dto.attribute) {
      let attribute = new XTR_PROD_ATTRIBUTE();
      attribute.id = dto.attribute.id;
      attribute.name = dto.attribute.name;
      attribute = await this.attrRep.save(attribute, { reload: true });

      const attrValuesArray: XTR_ATTRIBUTE_VALUE[] = [];
      const attrValues = dto.attribute.attributeValues;
      console.log(`attrValues ${JSON.stringify(attrValues, null, 2)}`);
      for (const attrVal of attrValues) {
        this.logger.warn(
          `attrVal at start of loop ${JSON.stringify(attrVal, null, 2)}`,
        );
        const _attrValue = new XTR_ATTRIBUTE_VALUE();
        _attrValue.id = attrVal.value;

        _attrValue.title = attrVal.title ? attrVal.title : ' ';
        _attrValue.priceAdjustment = parseFloat(attrVal.priceAdjustment);
        this.logger.log(`_attrValue ${JSON.stringify(_attrValue, null, 2)}`);
        const attrValueDB = await this.attrValueRepo.save(_attrValue, {
          reload: true,
        });
        attrValuesArray.push(_attrValue);
      }

      attribute.attributeValues = attrValuesArray;
      attribute = await this.attrRep.save(attribute, { reload: true });
      const attributes: XTR_PROD_ATTRIBUTE[] = [];
      attributes.push(attribute);
      this.logger.log(`attributes ${JSON.stringify(attributes, null, 2)}`);
      prod.attributes = attributes;
      this.logger.log(
        `Prod attributes ${JSON.stringify(prod.attributes, null, 2)}`,
      );
    }

    if (dto.eans) {
      this.logger.log(`need to add eans`);

      const eanArray: XTR_PROD_ATTRIBUTE_EAN[] = [];
      for (const ean of dto.eans) {
        const _ean = new XTR_PROD_ATTRIBUTE_EAN();
        _ean.code = ean.ean;
        _ean.value = ean.value;
        this.logger.warn(`_ean is ${JSON.stringify(_ean, null, 2)}`);
        let eanDB = await this.prodEanRepo.findOne({
          where: { code: _ean.code },
        });
        if (!eanDB) {
          eanDB = await this.prodEanRepo.save(_ean, { reload: true });
        }
        eanArray.push(eanDB);
      }
      this.logger.warn(`ean list is ${JSON.stringify(eanArray, null, 2)}`);
      prod.eans = eanArray;
    }

    if (dto.ximage) {
      const ximage = await this.filesService.getXtrProdImage(dto.ximage);
      if (!ximage) {
        await this.filesService.uploadXtrStockFile(
          dto.ximage,
          'ximage',
          prod.id,
        );
      }
    }

    if (dto.ximage2) {
      const ximage2 = await this.filesService.getXtrProdImage(dto.ximage2);
      if (!ximage2) {
        await this.filesService.uploadXtrStockFile(
          dto.ximage2,
          'ximage2',
          prod.id,
        );
      }
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
      const bigmulti2 = await this.filesService.getXtrProdImage(dto.bigmulti2);
      if (!bigmulti2) {
        await this.filesService.uploadXtrStockFile(
          dto.bigmulti2,
          'bigmulti2',
          prod.id,
        );
      }
    }

    if (dto.bigmulti3) {
      const bigmulti3 = await this.filesService.getXtrProdImage(dto.bigmulti3);
      if (!bigmulti3) {
        await this.filesService.uploadXtrStockFile(
          dto.bigmulti3,
          'bigmulti3',
          prod.id,
        );
      }
    }

    return _prod;
  }
}
