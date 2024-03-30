import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { CUSTOMER_INVOICE_PDF } from './entity/customerInvoiceFile.entity';
import { EDC_PRODUCT_FILE } from './entity/productFile.entity';
import { PUBLIC_FILE } from './entity/publicFile.entity';
import { XTR_CATEGORY_IMAGE_REMOTE_FILE } from './entity/xtrCategoryFile.entity';
import { XTR_PRODUCT_IMAGE_REMOTE_FILE } from './entity/stockFile.entity';
import { XTR_BRAND_IMAGE_REMOTE_FILE } from './entity/xtraderBrandFile.entity';
//import { S3 } from 'aws-sdk';
//  import { Upload } from "@aws-sdk/lib-storage";
import { HttpService } from '@nestjs/axios';
import { XTR_PRODUCT } from 'src/xtrader/entity/xtr-product.entity';
import axios from 'axios';

@Injectable()
export class RemoteFilesService {
  constructor(
    @InjectRepository(PUBLIC_FILE)
    private publicFilesRepository: Repository<PUBLIC_FILE>,
    @InjectRepository(EDC_PRODUCT_FILE)
    private productFilesRepository: Repository<EDC_PRODUCT_FILE>,
    @InjectRepository(CUSTOMER_INVOICE_PDF)
    private custInvRepo: Repository<CUSTOMER_INVOICE_PDF>,
    @InjectRepository(XTR_CATEGORY_IMAGE_REMOTE_FILE)
    private xtrCatRepo: Repository<XTR_CATEGORY_IMAGE_REMOTE_FILE>,
    @InjectRepository(XTR_PRODUCT_IMAGE_REMOTE_FILE)
    private xtrProdRepo: Repository<XTR_PRODUCT_IMAGE_REMOTE_FILE>,
    @InjectRepository(XTR_BRAND_IMAGE_REMOTE_FILE)
    private xtrBrandRepo: Repository<XTR_BRAND_IMAGE_REMOTE_FILE>,
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}
  logger = new Logger('RemoteFilesService');

  async uploadPublicFile(dataBuffer: Buffer, filename: string) {
    const client = new S3Client({});
    const key = `${uuid()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: key,
      Body: dataBuffer,
    });
    // const s3 = new S3();

    try {
      const response = await client.send(command);

      const newFile = this.publicFilesRepository.create({
        key: key,
        //url: uploadResult.Location,
      });
      await this.publicFilesRepository.save(newFile);
      return newFile;
    } catch (err) {
      throw new BadRequestException(JSON.stringify(err));
    }

    // const uploadResult = await new Upload({
    //   client: s3,

    //   params: {
    //       Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
    //       Body: dataBuffer,
    //       Key: `${uuid()}-${filename}`,
    //     }
    // })
    //   .done();

    // const newFile = this.publicFilesRepository.create({
    //   key: uploadResult.Key,
    //   url: uploadResult.Location,
    // });
    // await this.publicFilesRepository.save(newFile);
    // return newFile;
  }

  async deletePublicFile(fileId: number) {
    const file = await this.publicFilesRepository.findOne({
      where: { id: fileId },
    });
    const client = new S3Client({});
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: file.key,
    });

    try {
      const response = await client.send(command);

      await this.publicFilesRepository.delete(fileId);
    } catch (err) {
      console.error(err);
    }
    //const s3 = new S3();
    // await s3.deleteObject({
    //   Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
    //   Key: file.key,
    // });
  }

  async deletePublicFileWithQueryRunner(
    fileId: number,
    queryRunner: QueryRunner,
  ) {
    const file = await queryRunner.manager.findOneBy(PUBLIC_FILE, {
      id: fileId,
    });
    //const s3 = new S3();
    const client = new S3Client({});
    const command = new DeleteObjectCommand({
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: file.key,
    });
    try {
      const response = await client.send(command);
    } catch (err) {
      console.error(err);
      await queryRunner.manager.delete(PUBLIC_FILE, fileId);
    }
    // await s3.deleteObject({
    //   Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
    //   Key: file.key,
    // });
  }
  Xtr;
  public async updateXtrBrandFile(
    brandId: number,
    key: string,
  ): Promise<XTR_BRAND_IMAGE_REMOTE_FILE> {
    let newFile = this.xtrBrandRepo.create({
      key: key,
      brand: {
        id: brandId,
      },
    });
    newFile = await this.xtrBrandRepo.save(newFile, {
      reload: true,
    });
    return newFile;
  }
  public async uploadXtrBrandFile(
    dataBuffer: Buffer,
    categoryID: number,
    fileName: string,
  ): Promise<XTR_BRAND_IMAGE_REMOTE_FILE> {
    const client = new S3Client({});
    const key = `XTR-BRAND-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_XTR_CAT_BUCKET_NAME'),
      Key: key,
      Body: dataBuffer,
    });
    try {
      const response = await client.send(command);
      if (response.$metadata.httpStatusCode !== 200) {
        throw new BadRequestException(`Could not save ${fileName} to AWS `);
      }
      let newFile = this.xtrBrandRepo.create({
        key: key,
        brand: {
          id: categoryID,
        },
      });
      newFile = await this.xtrBrandRepo.save(newFile, {
        reload: true,
      });
      return newFile;
    } catch (err) {
      throw new BadRequestException(JSON.stringify(err));
    }
  }

  public async uploadXtrCategoryFile(
    dataBuffer: Buffer,
    categoryID: number,
    fileName: string,
  ): Promise<XTR_CATEGORY_IMAGE_REMOTE_FILE> {
    const client = new S3Client({});
    const key = `XTR-CAT-${fileName}`;
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_XTR_CAT_BUCKET_NAME'),
      Key: key,
      Body: dataBuffer,
    });
    try {
      const response = await client.send(command);
      if (response.$metadata.httpStatusCode !== 200) {
        throw new BadRequestException(`Could not save ${fileName} to AWS `);
      }
      let newFile = this.xtrCatRepo.create({
        key: key,
        //location: uploadResult.Location,
        cat: {
          id: categoryID,
        },
      });
      newFile = await this.xtrCatRepo.save(newFile, {
        reload: true,
      });
      return newFile;
    } catch (err) {
      throw new BadRequestException(JSON.stringify(err));
    }
  }
  async uploadProductFile(
    dataBuffer: Buffer,
    productId: number,
    filename: string,
  ) {
    //const s3 = new S3();
    const client = new S3Client({});
    const key = `${uuid()}-${filename}`;
    const command = new PutObjectCommand({
      Bucket: this.configService.get('AWS_PRODUCT_BUCKET_NAME'),
      Key: key,
      Body: dataBuffer,
    });

    try {
      const response = await client.send(command);
      let newFile = this.productFilesRepository.create({
        key: key,
        //location: uploadResult.Location,
        product: {
          id: productId,
        },
      });
      newFile = await this.productFilesRepository.save(newFile, {
        reload: true,
      });
      return newFile;
    } catch (err) {
      throw new BadRequestException(JSON.stringify(err));
    }
    //   const uploadResult = await new Upload({
    //     client: s3,

    //     params: {
    //         Bucket: this.configService.get('AWS_PRODUCT_BUCKET_NAME'),
    //         Body: dataBuffer,
    //         // Key: `${uuid()}-${filename}`,
    //         Key: filename,
    //       }
    //   })
    //     .done();

    //   let newFile = this.productFilesRepository.create({
    //     key: uploadResult.Key,
    //     location: uploadResult.Location,
    //     product: {
    //       id: productId,
    //     },
    //   });
    //   newFile = await this.productFilesRepository.save(newFile, { reload: true });
    //   return newFile;
  }

  async getLogo() {
    const client = new S3Client({});
    const key = `b0e2d522-39d7-458c-802f-df499c04b946-invoice-{order.id}.pdf`;
    const getCommand = new GetObjectCommand({
      Bucket: 'saint-sinners-product-backet', //this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
      Key: key, //this.configService.get('AWS_LOGO_KEY'),
    });

    try {
      const data = await client.send(getCommand);
      // process data.
    } catch (error) {
      // error handling.
      const { requestId, cfId, extendedRequestId } = error.$$metadata;
      this.logger.warn({ requestId, cfId, extendedRequestId });
      this.logger.warn(`error name: ${error.name}`);
    } finally {
    }

    this.logger.error(`after try-catch block`);
  }
  async uploadCustomerPdfFile(
    dataBuffer: Buffer,
    orderId: string,
    filename: string,
  ) {
    const client = new S3Client({});
    const key = `${filename}`;
    const putCommand = new PutObjectCommand({
      Bucket: this.configService.get('AWS_INVOICE_BUCKET_NAME'),
      Key: key,
      Body: dataBuffer,
      //ServerSideEncryption:
      ContentType: 'application/pdf',
    });
    try {
      const resp = await client.send(putCommand);
      const result = resp.$metadata.httpStatusCode;
      this.logger.log(
        `upload invoice pdf result ${JSON.stringify(result, null, 2)}`,
      );
      let newFile = this.custInvRepo.create({
        key: key,
        order: { id: orderId },
      });
      newFile = await this.custInvRepo.save(newFile, {
        reload: true,
      });
      return newFile;
    } catch (err) {
      this.logger.warn(`Save order error ${err.message} `);
    }
  }

  async getXtrProdImage(
    name: string,
  ): Promise<XTR_PRODUCT_IMAGE_REMOTE_FILE | null> {
    return this.xtrProdRepo.findOne({ where: { key: name } });
  }

  async uploadXtrStockFile(fileName: string, category: string, prodId: number) {
    const imgUrl = `${process.env.XTRADER_IMG_URL}${fileName}`;
    this.logger.log(
      `uploadXtrStockFile called with filename: ${fileName} cat ${category} and prod with id ${prodId}`,
    );
    const fileNameParts = fileName.split('.');
    const fileType = fileNameParts[1];
    this.logger.log(`file category: ${category} fileType: ${fileType}`);
    let thumbId: number;

    let ximage: number;
    let ximage2: number;
    let ximage3: number;
    let ximage4: number;
    let ximage5: number;
    let multi1: number;
    let multi2: number;
    let multi3: number;
    let bigmulti1: number;
    let bigmulti2: number;
    let bigmulti3: number;

    switch (category) {
      case 'thumb':
        thumbId = prodId;
        break;
      case 'ximage':
        ximage = prodId;
        break;
      case 'ximage2':
        ximage2 = prodId;
        break;
      case 'ximage3':
        ximage3 = prodId;
        break;
      case 'ximage4':
        ximage4 = prodId;
        break;
      case 'ximage5':
        ximage5 = prodId;
        break;
      case 'multi1':
        multi1 = prodId;
        break;
      case 'multi2':
        multi2 = prodId;
        break;
      case 'multi3':
        multi3 = prodId;
        break;
      case 'bigmulti1':
        bigmulti1 = prodId;
        break;
      case 'bigmulti2':
        bigmulti2 = prodId;
        break;
      case 'bigmulti3':
        bigmulti3 = prodId;
        break;
    }
    this.logger.log(`ximageid after switch ${ximage}`);
    let imgFileBuff: Buffer;
    try {
      let imgFile = await this.httpService.axiosRef.get(imgUrl, {
        responseType: 'arraybuffer',
      });

      imgFileBuff = imgFile.data;
      const client = new S3Client({});
      const key = fileName;
      const command = new PutObjectCommand({
        Bucket: this.configService.get('AWS_XTR_STOCK_BUCKET_NAME'),
        Key: key,
        Body: imgFileBuff,
      });
      try {
        const response = await client.send(command);
        console.log(
          `response status from AWS ${JSON.stringify(
            response.$metadata.httpStatusCode,
          )}`,
        );
        if (response.$metadata.httpStatusCode !== 200) {
          throw new BadRequestException(`Could not save ${fileName} to AWS `);
        }
        let newFile = this.xtrProdRepo.create({
          key: key,
          //location: uploadResult.Location,
          category,
          fileType,
          thumb: {
            id: thumbId,
          },

          ximage: {
            id: ximage,
          },
          ximage2: {
            id: ximage2,
          },
          ximage3: {
            id: ximage3,
          },
          ximage4: {
            id: ximage4,
          },
          ximage5: {
            id: ximage5,
          },
          multi1: {
            id: multi1,
          },
          multi12: {
            id: multi2,
          },
          multi13: {
            id: multi3,
          },
          bigmulti1: {
            id: bigmulti1,
          },
          bigmulti2: {
            id: bigmulti2,
          },
          bigmulti3: {
            id: bigmulti3,
          },
        });
        newFile = await this.xtrProdRepo.save(newFile, {
          reload: true,
        });

        return newFile;
      } catch (err) {
        throw new BadRequestException(JSON.stringify(err));
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        this.logger.warn(`Axios error ${JSON.stringify(err.status)}`);
        if (err.response) {
          this.logger.warn(
            `Axios message ${JSON.stringify(err.response.statusText)}`,
          );
          this.logger.warn(`Axios message ${JSON.stringify(err.message)}`);
        } else {
          this.logger.warn(`err ${JSON.stringify(err, null, 2)}`);
        }
      }
      this.logger.warn(`Could not find image from xtrader ${fileName} `);
    }
  }
}
