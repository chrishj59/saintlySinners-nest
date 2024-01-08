import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CUSTOMER_INVOICE_PDF } from './entity/customerInvoiceFile.entity';
import { EDC_PRODUCT_FILE } from './entity/productFile.entity';
import { PUBLIC_FILE } from './entity/publicFile.entity';
import { RemoteFilesController } from './remote-files.controller';
import { RemoteFilesService } from './remote-files.service';
import { XTR_PRODUCT_IMAGE_REMOTE_FILE } from './entity/stockFile.entity';
import { XTR_CATEGORY_IMAGE_REMOTE_FILE } from './entity/xtrCategoryFile.entity';
import { HttpModule } from '@nestjs/axios';
// import { XTR_CATEGORY } from 'src/xtrader/entity/xtr-Category.entity';
// import { XtraderModule } from 'src/xtrader/xtrader.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PUBLIC_FILE,
      EDC_PRODUCT_FILE,
      CUSTOMER_INVOICE_PDF,
      XTR_CATEGORY_IMAGE_REMOTE_FILE,
      XTR_PRODUCT_IMAGE_REMOTE_FILE,
    ]),
    HttpModule,
  ],
  providers: [RemoteFilesService],
  controllers: [RemoteFilesController],
  exports: [RemoteFilesService],
})
export class RemoteFilesModule {}
