import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { title } from 'process';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';
import { LessThanOrEqual, Repository } from 'typeorm';

import { ResponseMessageDto } from '../dtos/response-message-dto';
import { EDC_BRAND } from '../edc/entities/edc-brand';
import { BrandCategoryEnum } from '../enums/Brand-category.enum';
import { BrandCatDto } from './dtos/brand-cat.dto';
import { BrandIdDto } from './dtos/brand-id.dto';
import { BrandDto } from './dtos/brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(EDC_BRAND)
    private brandRepo: Repository<EDC_BRAND>,
    @InjectRepository(EDC_PRODUCT)
    private producRepo: Repository<EDC_PRODUCT>,
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
    console.log('getBrand');
    console.log(dto);

    let data: EDC_BRAND[] | null;
    if (dto.id) {
      const brand = await this.brandRepo.findOne({
        where: { id: Number(dto.id) },
      });
      if (brand) {
        const brandDto = new BrandDto();
        brandDto.id = brand.id;
        brandDto.categoryType = brand.categoryType;
        brandDto.title = brand.title;
        brandDto.catDescription = brand.description;
        brandDto.catLevel = brand.catLevel;

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
        },

        order: {
          title: 'ASC',
        },
      });
    } else {
      data = await this.brandRepo.find({
        where: { catLevel: LessThanOrEqual(dto.catLevel) },
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

      return brandDto;
    });
    return ret;
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

  public async getBrandProducts(
    dto: BrandIdDto,
  ): Promise<EDC_PRODUCT[] | ResponseMessageDto> {
    const brandId = Number(dto.id);
    console.log(brandId);

    const query = await this.producRepo.createQueryBuilder('edc_product');
    let products: EDC_PRODUCT[];
    try {
      products = await query
        .leftJoinAndSelect('edc_product.images', 'images')
        .leftJoinAndSelect('edc_product.variants', 'variants')
        .leftJoinAndSelect('edc_product.defaultCategory', 'defaultCategory')
        .andWhere('edc_product.brandId = :brandid', { brandid: brandId })
        .getMany();
      console.log('get one product full');
      console.log(products);
    } catch (e) {
      console.log('get products error');
      console.log(e);
    }

    // const products = await this.producRepo
    //   .createQueryBuilder('edc_product')
    //   //.leftJoinAndSelect('edc_product', 'images')
    //   //.innerJoinAndSelect('edc_brand', 'b', 'b.id = :brandId', { brandId: 94 })
    //   .where('edc_product.brandId = :brandid', { brandid: 94 })

    //   .getMany();

    console.log('brand');
    console.log(products);
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
