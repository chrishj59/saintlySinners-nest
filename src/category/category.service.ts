import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EDC_CATEGORY } from 'src/edc/entities/edc-category.entity';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import { Repository } from 'typeorm';
import { CategoryIdDto } from './dtos/categoryId.dto';
import { ResponseMessageDto } from 'src/dtos/response-message-dto';
import { CategoryDto } from './dtos/category.dto';
import { MessageStatusEnum } from 'src/enums/Message-status.enum';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(EDC_CATEGORY)
    private catRepo: Repository<EDC_CATEGORY>,
    @InjectRepository(EDC_PRODUCT)
    private producRepo: Repository<EDC_PRODUCT>,
  ) {}
  logger = new Logger('Category service');

  public async category(
    dto: CategoryDto,
  ): Promise<EDC_CATEGORY[] | EDC_CATEGORY> {
    if (dto.id) {
      // called for single category
      return await this.catRepo.findOne({
        where: { id: dto.id },
        relations: ['childCategories', 'childCategories.childCategories'],
      });
      //return cat; //await this.catRepo.findOne({ where: { id: dto.id } });
    } else if (dto.menulevel) {
      // called for top level menuItem

      return await this.catRepo.find({
        where: { menulevel: dto.menulevel, onMenu: true },
        relations: [
          'childCategories',
          'childCategories.childCategories',
          'parentCategory',
        ],
      });
    } else {
      return await this.catRepo.find({
        relations: [
          'childCategories',
          'childCategories.childCategories',
          'parentCategory',
        ],
      });
    }
  }

  public async getCategoryProducts(
    dto: CategoryIdDto,
  ): Promise<EDC_PRODUCT[] | ResponseMessageDto> {
    const categoryid = Number(dto.id);
    const query = this.producRepo.createQueryBuilder('edc_product');
    let products: EDC_PRODUCT[];

    try {
      products = await query
        .leftJoinAndSelect('edc_product.images', 'images')
        .leftJoinAndSelect('edc_product.variants', 'variants')
        .leftJoinAndSelect('edc_product.defaultCategory', 'defaultCategory')
        .leftJoinAndSelect('edc_product.newCategories', 'newCategories')
        .andWhere('newCategories.id = :categoryid', {
          categoryid: categoryid,
        })
        .getMany();
      products = products.map((p) => {
        p.b2c = parseFloat(p.b2c.toFixed(2));
        if (!p.defaultCategory) {
          p.defaultCategory = p.newCategories[0];
        }
        return p;
      });
    } catch (e) {
      this.logger.warn('get products error');
      this.logger.warn(e);
      throw new BadRequestException(`Get Products error ${e}`);
    }

    if (products) {
      return products;
    } else {
      return {
        status: MessageStatusEnum.WARNING,
        message: `Reached CategoryProducts for category id ${categoryid} but no products found`,
      };
    }
  }

  public async updateCategories(
    dto: CategoryDto,
  ): Promise<EDC_CATEGORY | ResponseMessageDto> {
    try {
      const categoryDB = await this.catRepo.findOne({ where: { id: dto.id } });
      categoryDB.title = dto.title;
      categoryDB.menulevel = dto.menulevel;
      categoryDB.onMenu = dto.onMenu;
      // get children from DTO.
      let childCats: EDC_CATEGORY[] = [];
      for (const item of dto.childCategories) {
        const dbItem = await this.catRepo.findOne({ where: { id: item.id } });
        dbItem.menulevel = item.menulevel;
        dbItem.onMenu = item.onMenu;
        childCats.push(dbItem);
      }

      categoryDB.childCategories = childCats;
      //Get parent from DTO
      if (dto.parentCategory && dto.parentCategory.id) {
        const p = await this.catRepo.findOne({
          where: { id: dto.parentCategory.id },
        });
        categoryDB.parentCategory = p;
      }

      const updated = await this.catRepo.save(categoryDB, { reload: true });

      return updated;
    } catch (err) {
      throw new BadRequestException(`Could not update category: ${err}`);
    }
  }
}
