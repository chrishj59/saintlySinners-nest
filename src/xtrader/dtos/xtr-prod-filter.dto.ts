import { IsString } from '@nestjs/class-validator';

export class XtrProductFilterDto {
  @IsString()
  searchParam: string;
}
