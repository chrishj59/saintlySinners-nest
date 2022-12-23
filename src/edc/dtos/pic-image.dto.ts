import { IsString } from 'class-validator';

export class PicFileDto {
  @IsString()
  fileData: string;
}
