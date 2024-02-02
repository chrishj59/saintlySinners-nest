import { Module } from '@nestjs/common';
import { XtraderCategoryController } from './xtrader-category.controller';
import { XtraderCategoryService } from './xtrader-category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XTR_CATEGORY } from 'src/xtrader/entity/xtr-Category.entity';
import { XTR_CATEGORY_IMAGE_REMOTE_FILE } from 'src/remote-files/entity/xtrCategoryFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([XTR_CATEGORY, XTR_CATEGORY_IMAGE_REMOTE_FILE]),
  ],
  controllers: [XtraderCategoryController],
  providers: [XtraderCategoryService],
})
export class XtraderCategoryModule {}
