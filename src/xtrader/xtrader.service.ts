import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { XTR_CATEGORY } from './entity/xtr-Category.entity';
import { Repository } from 'typeorm';
import { XtrCategoryDto } from './dtos/xtr-category.dto';
import { FindOneNumberParams } from 'src/utils/findOneParamString';
import { RemoteFilesService } from 'src/remote-files/remote-files.service';
import { PUBLIC_FILE } from 'src/remote-files/entity/publicFile.entity';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class XtraderService {
  constructor(
    @InjectRepository(XTR_CATEGORY)
    private catRepo: Repository<XTR_CATEGORY>,
  ) // @InjectRepository(PUBLIC_FILE)
  // private publicFileRepo: Repository<PUBLIC_FILE>,
  // private readonly httpService: HttpService,
  // private readonly filesService: RemoteFilesService,
  {}
  private logger = new Logger('XtraderService');

  public async newCategory(dto: XtrCategoryDto): Promise<XTR_CATEGORY> {
    // is does the parent exist

    try {
      let cat = await this.catRepo.findOne({ where: { id: dto.id } });
      this.logger.log(`find cat returned ${cat}`);
      if (!cat) {
        cat = new XTR_CATEGORY();
        cat.id = dto.id;
      }

      const parent = await this.catRepo.findOne({
        where: { id: dto.parentId },
      });
      if (parent) {
        cat.parentCategory = parent;
      }

      if (dto.category_image) {
        const imgUrl = `${process.env.XTRADER_IMG_URL}${dto.category_image}`;
        // let imgFile = await this.httpService.axiosRef.get(imgUrl, {
        //   responseType: 'arraybuffer',
        // });
        // let imgFileBuff = Buffer.from(imgFile.data, 'binary');
      }

      // if(dto.imageKey){
      //   /** save imaage record */
      //   const catImage = new PublicFile();
      //   catImage.key

      cat.catName = dto.name;

      const _cat = await this.catRepo.save(cat, { reload: true });
      if (dto.category_image) {
        // const imgUrl = `${process.env.XTRADER_IMG_URL}${dto.category_image}`;
        // let imgFile = await this.httpService.axiosRef.get(imgUrl, {
        //   responseType: 'arraybuffer',
        // });
        // let imgFileBuff = Buffer.from(imgFile.data, 'binary');
        // const newFile = await this.filesService.uploadProductFile(
        //   picFileBuff,
        //   prod.id,
        //   // url,
        //   imageKey,
        // );
      }

      return _cat;
    } catch (err) {
      this.logger.error(`err ${JSON.stringify(err, null, 2)}`);
      throw new BadRequestException(
        `Could not create new XTRADER category with ${JSON.stringify(dto)}`,
      );
    }
  }

  public async getOneCategory(id: string): Promise<XTR_CATEGORY> {
    const _id = parseInt(id);
    try {
      const cat = await this.catRepo.findOne({ where: { id: _id } });
      this.logger.log(`find cat returned ${cat}`);
      return cat;
    } catch (err) {
      console.log(`Error getting one category ${JSON.stringify(err, null, 2)}`);
      throw new BadRequestException(
        `Error getting one category ${JSON.stringify(err, null, 2)}`,
      );
    }
  }
}
