import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XTR_CATEGORY } from 'src/xtrader/entity/xtr-Category.entity';
import { IsNull, Repository } from 'typeorm';

@Injectable()
export class XtraderCategoryService {
  constructor(
    @InjectRepository(XTR_CATEGORY)
    private catRepo: Repository<XTR_CATEGORY>,
  ) {}

  public async categoryMenu(): Promise<XTR_CATEGORY[]> {
    return this.catRepo.find({
      where: { parentCategory: IsNull() },
      order: { catName: 'ASC' },
    });
  }

  public async getCategoryById(id: number): Promise<XTR_CATEGORY> {
    return await this.catRepo.findOne({
      where: { id },
      relations: ['childCategories', 'parentCategory'],
      order: { childCategories: { catName: 'ASC' } },
    });
  }

  public async getCategories(): Promise<XTR_CATEGORY[]> {
    return this.catRepo.find({
      order: { catName: 'ASC' },
    });
  }
}
