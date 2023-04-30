import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryRunner, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

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

    private readonly configService: ConfigService,
  ) {}
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
      console.log(response);
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
      console.log(JSON.stringify(response));
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
      console.log(response);
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
      Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
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
}
