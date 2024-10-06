import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { title } from 'process';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';
import { LessThanOrEqual, Repository } from 'typeorm';

import { ResponseMessageDto } from '../dtos/response-message-dto';
import { EDC_BRAND } from '../edc/entities/edc-brand';
import { BrandCategoryEnum } from '../enums/Brand-category.enum';
import { BrandCatDto } from './dtos/brand-cat.dto';
import { BrandIdDto, XtrBrandIdDto } from './dtos/brand-id.dto';
import { BrandDto } from './dtos/brand.dto';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(EDC_BRAND)
    private brandRepo: Repository<EDC_BRAND>,
    @InjectRepository(EDC_PRODUCT)
    private producRepo: Repository<EDC_PRODUCT>,
    @InjectRepository(XTR_PRODUCT)
    private xtrProdRepo: Repository<XTR_PRODUCT>,
  ) {}
  logger = new Logger('Brands service');

  // public async getBrand() {
  //   const data = await this.brandRepo.find();
  //   const ret = data.map((b: EDC_BRAND) => {
  //     const brandDto = new BrandDto();
  //     brandDto.id = b.id;
  //     brandDto.categoryType = b.categoryType;
  //     brandDto.title = b.title;
  //     brandDto.catDescription = b.description;
  //     brandDto.catLevel = b.catLevel;

  //     return brandDto;
  //   });
  //   return ret;
  // }
  public async getBrand(dto: BrandCatDto): Promise<BrandDto[] | BrandDto> {
    let data: EDC_BRAND[] | null;
    if (dto.id) {
      const brand = await this.brandRepo.findOne({
        where: { id: Number(dto.id), onHomePage: dto.onHomePage },
      });
      if (brand) {
        const brandDto = new BrandDto();
        brandDto.id = brand.id;
        brandDto.categoryType = brand.categoryType;
        brandDto.title = brand.title;
        brandDto.catDescription = brand.description;
        brandDto.catLevel = brand.catLevel;
        brandDto.awsKey = brand.awsKey;
        brandDto.awsImageFormat = brand.awsImageFormat;
        brandDto.onHomePage = brand.onHomePage;
        return brandDto;
      }
    }
    if (dto.category) {
      data = await this.brandRepo.find({
        where: {
          categoryType:
            BrandCategoryEnum[
              dto.category.toUpperCase() as keyof BrandCategoryEnum
            ],
          catLevel: LessThanOrEqual(dto.catLevel),
          onHomePage: dto.onHomePage,
        },

        order: {
          title: 'ASC',
        },
      });
    } else {
      data = await this.brandRepo.find({
        where: {
          catLevel: LessThanOrEqual(dto.catLevel),
          onHomePage: dto.onHomePage,
        },
        order: { title: 'ASC' },
      });
    }

    const ret = data.map((b: EDC_BRAND) => {
      const brandDto = new BrandDto();
      brandDto.id = b.id;
      brandDto.categoryType = b.categoryType;
      brandDto.title = b.title;
      brandDto.catDescription = b.description;
      brandDto.catLevel = b.catLevel;
      brandDto.awsKey = b.awsKey;
      brandDto.awsImageFormat = b.awsImageFormat;
      brandDto.onHomePage = b.onHomePage;

      return brandDto;
    });
    return ret;
  }

  public async addBrand(dto: BrandDto): Promise<EDC_BRAND> {
    let brand: EDC_BRAND = new EDC_BRAND();
    brand.awsKey = dto.awsKey;
    brand.catLevel = dto.catLevel;
    if (dto.categoryType) {
      brand.categoryType =
        BrandCategoryEnum[
          dto.categoryType.toUpperCase() as keyof BrandCategoryEnum
        ];
    }
    brand.description = dto.catDescription;
    brand.id = dto.id;
    brand.title = dto.title;
    brand.onHomePage = dto.onHomePage;
    brand.awsKey = dto.awsKey;
    brand.awsImageFormat = dto.awsImageFormat;
    try {
      brand = await this.brandRepo.save(brand, { reload: true });
      return brand;
    } catch (err) {
      throw new InternalServerErrorException('Add Brand error', {
        cause: err,
        description: `Could not save brand with id ${dto.id}`,
      });
    }
  }
  public async updateBrand(
    dto: BrandDto,
  ): Promise<BrandDto | ResponseMessageDto> {
    let brand = await this.brandRepo.findOne({
      where: { id: Number(dto.id) },
      //relations: ['category'],
    });

    if (!brand) {
      throw new NotFoundException(`Could not find brand with id ${dto.id}`);
    }
    brand.catLevel = dto.catLevel;
    if (dto.categoryType) {
      brand.categoryType =
        BrandCategoryEnum[
          dto.categoryType.toUpperCase() as keyof BrandCategoryEnum
        ];
    }
    brand.description = dto.catDescription;
    brand.awsKey = dto.awsKey;
    brand.onHomePage = dto.onHomePage;
    brand.awsImageFormat = dto.awsImageFormat;
    brand = await this.brandRepo.save(brand, { reload: true });
    dto.id = brand.id;
    dto.catDescription = brand.description;
    dto.catLevel = brand.catLevel;
    dto.categoryType = brand.categoryType;

    const dtoRet = dto;
    return dtoRet;
  }

  public async BrandIdAll(): Promise<BrandIdDto[] | ResponseMessageDto> {
    try {
      const ids = await this.brandRepo.find({ select: ['id'] });
      if (!ids) {
        throw new NotFoundException('Could not find brands');
      }

      return ids;
    } catch (e) {
      throw new BadRequestException(`Error loading brand ids`);
    }
    return null;
  }

  public async getXtrBrandProducts(dto: BrandIdDto): Promise<XTR_PRODUCT[]> {
    const brandId = Number(dto.id);
    const query = this.xtrProdRepo.createQueryBuilder('xtr-product');

    try {
      // const products = await query
      //   .leftJoinAndSelect('xtr-product.thumb', 'thumb')
      //   .leftJoinAndSelect('xtr-product.brand', 'brand')
      //   // .andWhere('xtr-product.brandId = :brandid', { brandid: brandId })
      //   .getMany();

      const products = await this.xtrProdRepo.find({
        relations: { brand: true, category: true, reviews: true },
        where: { brand: { id: brandId } },
      });

      return products;
    } catch (e) {
      throw new BadRequestException(`Get products error ${e}`);
    }
  }

  public async getBrandProducts(
    dto: BrandIdDto,
  ): Promise<EDC_PRODUCT[] | ResponseMessageDto> {
    const brandId = Number(dto.id);

    const query = this.producRepo.createQueryBuilder('edc_product');
    let products: EDC_PRODUCT[];
    try {
      products = await query
        .leftJoinAndSelect('edc_product.images', 'images')
        .leftJoinAndSelect('edc_product.variants', 'variants')
        .leftJoinAndSelect('edc_product.defaultCategory', 'defaultCategory')
        .leftJoinAndSelect('edc_product.newCategories', 'newCategories')
        .andWhere('edc_product.brandId = :brandid', { brandid: brandId })
        .getMany();
    } catch (e) {
      throw new BadRequestException(`Get products error ${e}`);
    }
    products = products.map((p) => {
      p.b2c = parseFloat(p.b2c.toFixed(2));
      if (!p.defaultCategory) {
        p.defaultCategory = p.newCategories[0];
      }
      return p;
    });

    if (products) {
      return products;
    } else {
      return {
        status: MessageStatusEnum.SUCCESS,
        message: `Reached BrandProducts for brand id ${brandId}`,
      };
    }

    return null;
  }
}
