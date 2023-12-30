import { Module } from '@nestjs/common';
import { XtraderService } from './xtrader.service';
import { XtraderController } from './xtrader.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { XTR_CATEGORY_IMAGE_REMOTE_FILE } from 'src/remote-files/entity/xtrCategoryFile.entity';
// import { RemoteFilesModule } from 'src/remote-files/remote-files.module';
// import { HttpModule, HttpService } from '@nestjs/axios';
// import { PUBLIC_FILE } from 'src/remote-files/entity/publicFile.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([XTR_CATEGORY, XTR_CATEGORY_IMAGE_REMOTE_FILE]),
  ],
  providers: [XtraderService],
  controllers: [XtraderController],
})
export class XtraderModule {}
