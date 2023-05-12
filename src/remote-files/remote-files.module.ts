import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CUSTOMER_INVOICE_PDF } from './entity/customerInvoiceFile.entity';
import { EDC_PRODUCT_FILE } from './entity/productFile.entity';
import { PublicFile } from './entity/publicFile.entity';
import { RemoteFilesController } from './remote-files.controller';
import { RemoteFilesService } from './remote-files.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PublicFile,
      EDC_PRODUCT_FILE,
      CUSTOMER_INVOICE_PDF,
    ]),
  ],
  providers: [RemoteFilesService],
  controllers: [RemoteFilesController],
  exports: [RemoteFilesService],
})
export class RemoteFilesModule {}
