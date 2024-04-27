import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { ILike, In, MoreThan, Repository } from 'typeorm';
import { XtrCategoryDto } from './dtos/xtr-category.dto';
import { FindOneNumberParams } from 'src/utils/findOneParamString';
import { RemoteFilesService } from 'src/remote-files/remote-files.service';
import { PUBLIC_FILE } from 'src/remote-files/entity/publicFile.entity';

import { HttpService } from '@nestjs/axios';
import { AttributeValue, Ean, XtrProductDto } from './dtos/xtr-product.dto';
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
import { XTR_PRODUCT_IMAGE_REMOTE_FILE } from 'src/remote-files/entity/stockFile.entity';
import e from 'express';
import { isIteratable } from 'src/utils/helpers';
import { DtoEanType } from './types/dto.ean.type';
import { ProductRestrictedDto } from './dtos/xtr-prod-restricted.dto';
import { restrProdRespType } from 'src/xtrader/types/xtrRestrictedProdResponse.type';

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

  async productPost(dto: XtrProductDto) {
    const _ = require('lodash');
    this.logger.log(`productPost called with id ${JSON.stringify(dto.id)}`);
    let prod: XTR_PRODUCT;
    let isNewProd = true;
    const currProd = await this.prodRepo.findOne({
      where: { id: dto.id },
      relations: ['category', 'eans', 'attributes'],
    });

    if (currProd) {
      prod = currProd;
      isNewProd = false;
    } else {
      prod = new XTR_PRODUCT();
      isNewProd = true;
    }

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

    const cat = await this.getCategoryByName(dto.catName);
    prod.category = cat;

    if (isNewProd) {
      let brand = await this.getBrand(dto.brand);
      if (!brand) {
        const _brand = new XTR_BRAND();
        _brand.name = dto.brand;
        const _brandDB = await this.brandRepo.save(_brand, { reload: true });
        brand = _brandDB;
      }
      prod.brand = brand;
    }

    /** load images for product if in DTO */

    if (isNewProd) {
      if (dto.thumb) {
        const thumb = await this.filesService.uploadXtrStockFile(
          dto.thumb,
          'thumb',
          prod.id,
        );

        prod.thumb = thumb;
      }
    } else {
      let _thumb: XTR_PRODUCT_IMAGE_REMOTE_FILE = prod.thumb;

      if (!_thumb || _thumb.key !== dto.thumb) {
        // update an existing thumb image
        this.logger.log('update existing thumb ');
        _thumb = await this.filesService.uploadXtrStockFile(
          dto.thumb,
          'thumb',
          prod.id,
        );
        prod.thumb;
      } else {
        this.logger.warn(`No update required to thumb`);
      }
    }

    if (isNewProd) {
      if (dto.eans) {
        for (const ean of dto.eans) {
          const _ean = new XTR_PROD_ATTRIBUTE_EAN();
          _ean.code = ean.ean;
          _ean.value = ean.value;
          prod.eans.push(_ean);
        }
      }
    } else {
      if (isIteratable(dto.eans)) {
        for (const ean of dto.eans) {
          if (prod.eans.length === 0) {
            // no product eans so add

            const _ean = new XTR_PROD_ATTRIBUTE_EAN();
            _ean.code = ean.ean;
            _ean.value = ean.value;

            prod.eans.push(_ean);
          } else {
            // there are existing eans so update existing so add

            const eanIdx = prod.eans.findIndex((prodEan) => {
              return prodEan.code === ean.ean;
            });

            if (eanIdx === -1) {
              // ean does not exist create a new one

              const _ean = new XTR_PROD_ATTRIBUTE_EAN();
              _ean.code = ean.ean;
              _ean.value = ean.value;

              prod.eans.push(_ean);
            } else {
              // update the ean

              const _ean = prod.eans[eanIdx];
              _ean.code = ean.ean;
              _ean.value = ean.value;

              prod.eans[eanIdx] = _ean;
            }
          }
        }
      }
    }

    if (isNewProd) {
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
    } else {
      if ((!prod.ximage && dto.ximage) || prod.ximage.key !== dto.ximage) {
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
    }

    if (isNewProd) {
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
    } else {
      if (!_.isEqual(prod.ximage2.key, dto.ximage2)) {
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
    }

    if (isNewProd) {
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
    } else {
      if (
        (prod.ximage3 === null && dto.ximage3.length > 0) ||
        (prod.ximage3 && prod.ximage3.key !== dto.ximage3)
      ) {
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
      }
    }

    if (isNewProd) {
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
    } else {
      if (
        (prod.ximage4 === null && dto.ximage4.length > 0) ||
        (prod.ximage4 && prod.ximage4.key !== dto.ximage4)
      ) {
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
      }
    }

    if (isNewProd) {
      if (dto.ximage5) {
        const ximage5 = await this.filesService.getXtrProdImage(dto.ximage5);
        if (!ximage5) {
          await this.filesService.uploadXtrStockFile(
            dto.ximage5,
            'ximage5',
            prod.id,
          );
        }
      }
    } else {
      if (
        (prod.ximage5 === null && dto.ximage5.length > 0) ||
        (prod.ximage5 && prod.ximage5.key !== dto.ximage5)
      ) {
        if (dto.ximage5) {
          const ximage5 = await this.filesService.getXtrProdImage(dto.ximage5);
          if (!ximage5) {
            await this.filesService.uploadXtrStockFile(
              dto.ximage5,
              'ximage5',
              prod.id,
            );
          }
        }
      }
    }

    if (isNewProd) {
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
    } else {
      if (
        (prod.multi1 === null && dto.multi1.length > 0) ||
        (prod.multi1 && prod.multi1.key !== dto.multi1)
      ) {
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
      }
    }

    if (isNewProd) {
      if (dto.multi2) {
        const multi2 = await this.filesService.getXtrProdImage(dto.multi2);
        if (!multi2) {
          await this.filesService.uploadXtrStockFile(
            dto.multi2,
            'multi2',
            prod.id,
          );
        }
      } else {
        if (
          (prod.multi2 === null && dto.multi2.length > 0) ||
          (prod.multi2 && prod.multi2.key !== dto.multi2)
        ) {
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
        }
      }
    }

    if (isNewProd) {
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
    } else {
      if (
        (prod.multi3 === null && dto.multi3.length > 0) ||
        (prod.multi3 && prod.multi3.key !== dto.multi3)
      ) {
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
      }
    }

    if (isNewProd) {
      if (dto.bigmulti1) {
        const bigmulti1 = await this.filesService.getXtrProdImage(
          dto.bigmulti1,
        );
        if (!bigmulti1) {
          await this.filesService.uploadXtrStockFile(
            dto.bigmulti1,
            'bigmulti1',
            prod.id,
          );
        }
      }
    } else {
      if (
        (prod.bigmulti1 === null && dto.bigmulti1.length > 0) ||
        (prod.bigmulti1 && prod.bigmulti1.key !== dto.bigmulti1)
      ) {
        if (dto.bigmulti1) {
          const bigmulti1 = await this.filesService.getXtrProdImage(
            dto.bigmulti1,
          );
          if (!bigmulti1) {
            await this.filesService.uploadXtrStockFile(
              dto.bigmulti1,
              'bigmulti1',
              prod.id,
            );
          }
        }
      }
    }

    if (isNewProd) {
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
    } else {
      if (
        (prod.bigmulti2 === null && dto.bigmulti2.length > 0) ||
        (prod.bigmulti2 && prod.bigmulti2.key !== dto.bigmulti2)
      ) {
        if (dto.bigmulti2) {
          const bigmulti2 = await this.filesService.getXtrProdImage(
            dto.bigmulti2,
          );
          if (!bigmulti2) {
            await this.filesService.uploadXtrStockFile(
              dto.bigmulti2,
              'image_bigmulti2',
              prod.id,
            );
          }
        }
      }
    }

    if (isNewProd) {
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
    } else {
      if (
        (prod.bigmulti3 === null && dto.bigmulti3.length > 0) ||
        (prod.bigmulti3 && prod.bigmulti3.key !== dto.bigmulti3)
      ) {
        if (dto.bigmulti3) {
          const bigmulti3 = await this.filesService.getXtrProdImage(
            dto.bigmulti3,
          );
          if (!bigmulti3) {
            await this.filesService.uploadXtrStockFile(
              dto.bigmulti3,
              'image_bigmulti3',
              prod.id,
            );
          }
        }
      }
    }
    // let _prod: XTR_PRODUCT;
    // if (isNewProd) {
    //   _prod = await this.prodRepo.save(prod, { reload: true });
    // } else {
    //   _prod = prod;
    // }

    if (isNewProd) {
      if (dto.attributes) {
        let attribute = new XTR_PROD_ATTRIBUTE();
        // attribute.attributeId = Number(dto.attributes.attributeValues.value);
        // attribute.name = dto.attributes.attributeValues.title;
        // attribute.product = prod;
        attribute = await this.attrRep.save(attribute, { reload: true });

        const attrValuesArray: XTR_ATTRIBUTE_VALUE[] = [];
        const attrValues = dto.attributes.attributeValues;
        if (isIteratable(attrValues)) {
          // for (const attrVal of attrValues) {
          //   this.logger.warn(
          //     `attrVal at start of loop 505 ${JSON.stringify(
          //       attrVal,
          //       null,
          //       2,
          //     )}`,
          //   );
          //   let _attrValue = await this.attrValueRepo.findOne({
          //     where: { id: attrVal.id },
          //   });
          //   this.logger.warn(
          //     `_attrValue ${JSON.stringify(_attrValue, null, 2)}`,
          //   );
          //   // if (!_attrValue) {
          //   //   _attrValue = new XTR_ATTRIBUTE_VALUE();
          //   //   _attrValue.id = Number(attrVal.value);
          //   //   _attrValue.title = attrVal.title ? attrVal.title : ' ';
          //   //   _attrValue.priceAdjustment = parseFloat(attrVal.priceAdjust);
          //   //   const attrValueDB = await this.attrValueRepo.save(_attrValue, {
          //   //     reload: true,
          //   //   });
          //   // }
          //   attrValuesArray.push(_attrValue);
          // }
        }

        attribute.attributeValues = attrValuesArray;
        attribute = await this.attrRep.save(attribute, { reload: true });
      }
    } else {
      // update if a change

      let prodAttributesIdx: number;
      let prodAttributes: XTR_PROD_ATTRIBUTE;
      if (isIteratable(prod.attributes)) {
        prodAttributesIdx = prod.attributes.findIndex(
          (attr: XTR_PROD_ATTRIBUTE, idx: number) => {
            const found = attr.attributeId === Number(dto.attributes.id);
            if (found) {
              prodAttributes = attr;
            }
            return found;
          },
        );
      } else {
        this.logger.warn(`prod.attributes not an array`);
      }
      if (!prodAttributes) {
        const prodAttrubutes: XTR_PROD_ATTRIBUTE[] = [];
        // if (!prod.attributes || prod.attributes.length === 0) {
        /** no prod attrubute so create */

        if (dto.attributes) {
          let attribute = new XTR_PROD_ATTRIBUTE();
          attribute.attributeId = dto.attributes.attributeId;
          attribute.name = dto.attributes.name;
          // attribute.product = prod;
          // attribute = await this.attrRep.save(attribute, { reload: true });

          const attrValuesArray: XTR_ATTRIBUTE_VALUE[] = [];
          const attrValues = dto.attributes.attributeValues;

          for (const attrVal of attrValues) {
            const _attrValue = new XTR_ATTRIBUTE_VALUE();
            _attrValue.ean = attrVal.ean;
            _attrValue.id = Number(attrVal.value);
            _attrValue.atrributeValueId = Number(attrVal.value);
            _attrValue.title = attrVal.title;
            _attrValue.priceAdjustment = attrVal.priceAdjust;
            if (attribute.name === 'Size') {
              _attrValue.inStock = true;
            }
            attrValuesArray.push(_attrValue);

            // attrValuesArray.push(_attrValue);
          }

          attribute.attributeValues = attrValuesArray;
          prodAttrubutes.push(attribute);
          console.log(
            `prodAttrubutes is ${JSON.stringify(prodAttrubutes, null, 2)}`,
          );
          prod.attributes = prodAttrubutes;
        }
      } else {
        /** neeed to update prod updates */
        if (isIteratable(prodAttributes.attributeValues)) {
        } else {
          if (isIteratable(dto.attributes.attributeValues)) {
            const prodAttributeValues: XTR_ATTRIBUTE_VALUE[] = [];

            dto.attributes.attributeValues.forEach(
              (dtoAttrVal: AttributeValue) => {
                const _prodAttribValue = new XTR_ATTRIBUTE_VALUE();
                _prodAttribValue.id = Number(dtoAttrVal.value);
                _prodAttribValue.atrributeValueId = Number(dtoAttrVal.value);
                _prodAttribValue.title = dtoAttrVal.title;
                _prodAttribValue.priceAdjustment = dtoAttrVal.priceAdjust;
                if (prodAttributes.name === 'Size') {
                  _prodAttribValue.inStock = true;
                }

                prodAttributeValues.push(_prodAttribValue);
              },
            );
            prodAttributes.attributeValues = prodAttributeValues;
          }
        }
      }
    }

    this.logger.log('before save');
    const _prod = await this.prodRepo.save(prod, { reload: true });
    this.logger.log(`after save id: ${_prod.id}`);
    return _prod;
    // return prod;
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
    const prods: XtraderStockItem[] = dto.products;

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
          inStockItems.push(p.item);
        } else if (p.stockItem.level === 'No Stock.') {
          noStockItems.push(p.item);
        }
      } else {
        const item = p.item;

        //TODO: make sure item is a tring
        if (item) stockSizes.push(item);
      }
    });

    if (inStockItems.length > 0) {
      let inStockRows = await this.prodRepo
        .createQueryBuilder('xtr-product')
        .update(XTR_PRODUCT)
        .set({ stockStatus: XtrProdStockStatusEnum.IN })
        .where({ model: In(inStockItems) })
        .execute();

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
      const _stockSizes = await this.prodRepo
        .createQueryBuilder('xtr-product')
        .leftJoinAndSelect('xtr-product.attributes', 'attributes')

        .where({ model: In(stockSizes) })
        .getMany();
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

  public async restrictedProductPost(
    dto: ProductRestrictedDto,
  ): Promise<restrProdRespType> {
    const prodIds = dto.productIds;
    const restictedRows = await this.prodRepo
      .createQueryBuilder('xtr-product')
      .update(XTR_PRODUCT)
      .set({ stripeRestricted: true })
      .where({ id: In(prodIds) })
      .execute();
    this.logger.log(`restictedRows ${JSON.stringify(restictedRows, null, 2)}`);
    const updated = restictedRows.affected;
    const restrResponse: restrProdRespType = {
      message: 'updated:',
      quantity: updated,
    };
    return restrResponse;
  }
}
