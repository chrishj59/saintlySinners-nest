import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EDC_CATEGORY } from 'src/edc/entities/edc-category.entity';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import { XTR_CATEGORY } from 'src/xtrader/entity/xtr-Category.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      EDC_CATEGORY,
      EDC_PRODUCT,
      XTR_PRODUCT,
      XTR_CATEGORY,
    ]),
  ],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
