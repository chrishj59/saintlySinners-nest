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
import { PublicFile } from './entity/publicFile.entity';

//import { S3 } from 'aws-sdk';
//  import { Upload } from "@aws-sdk/lib-storage";
@Injectable()
export class RemoteFilesService {
  constructor(
    @InjectRepository(PublicFile)
    private publicFilesRepository: Repository<PublicFile>,
    @InjectRepository(EDC_PRODUCT_FILE)
    private productFilesRepository: Repository<EDC_PRODUCT_FILE>,
    @InjectRepository(CUSTOMER_INVOICE_PDF)
    private custInvRepo: Repository<CUSTOMER_INVOICE_PDF>,

    private readonly configService: ConfigService,
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
    const file = await queryRunner.manager.findOneBy(PublicFile, {
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
      await queryRunner.manager.delete(PublicFile, fileId);
    }
    // await s3.deleteObject({
    //   Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
    //   Key: file.key,
    // });
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
      this.logger.log(`s3 result code: ${result}`);
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
}
