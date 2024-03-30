import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from '@nestjs/class-validator';
import { XTR_BRAND_IMAGE_REMOTE_FILE } from 'src/remote-files/entity/xtraderBrandFile.entity';

export class XtrBandImageDto {
  @IsOptional()
  @IsString()
  id: string;

  @IsString()
  key: string;

  @IsString()
  imageData: string;

  @IsString()
  imageFormat: string;
}
export class XtrBrandNewDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  imageName: string;

  @IsOptional()
  image?: XtrBandImageDto;

  @IsBoolean()
  isFavourite: boolean;

  @IsNumber()
  ranking: number;
}
