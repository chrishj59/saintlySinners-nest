import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EDC_CATEGORY } from 'src/edc/entities/edc-category.entity';
import { EDC_PRODUCT } from 'src/edc/entities/edc-product';

@Module({
  imports: [TypeOrmModule.forFeature([EDC_CATEGORY, EDC_PRODUCT])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
