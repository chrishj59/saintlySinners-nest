import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { QueryRunner, Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';

import { EDC_PRODUCT_FILE } from './entity/productFile.entity';
import { PublicFile } from './entity/publicFile.entity';

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
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
      })
      .promise();

    const newFile = this.publicFilesRepository.create({
      key: uploadResult.Key,
      url: uploadResult.Location,
    });
    await this.publicFilesRepository.save(newFile);
    return newFile;
  }

  async deletePublicFile(fileId: number) {
    const file = await this.publicFilesRepository.findOne({
      where: { id: fileId },
    });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await this.publicFilesRepository.delete(fileId);
  }

  async deletePublicFileWithQueryRunner(
    fileId: number,
    queryRunner: QueryRunner,
  ) {
    const file = await queryRunner.manager.findOneBy(PublicFile, {
      id: fileId,
    });
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.configService.get('AWS_PUBLIC_BUCKET_NAME'),
        Key: file.key,
      })
      .promise();
    await queryRunner.manager.delete(PublicFile, fileId);
  }

  async uploadProductFile(
    dataBuffer: Buffer,
    productId: number,
    filename: string,
  ) {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.configService.get('AWS_PRODUCT_BUCKET_NAME'),
        Body: dataBuffer,
        // Key: `${uuid()}-${filename}`,
        Key: filename,
      })
      .promise();

    let newFile = this.productFilesRepository.create({
      key: uploadResult.Key,
      location: uploadResult.Location,
      product: {
        id: productId,
      },
    });
    newFile = await this.productFilesRepository.save(newFile, { reload: true });
    return newFile;
  }
}
