import { IsOptional, IsString } from 'class-validator';

export class BlogNewDto {
  @IsString()
  title: string;
  @IsString()
  @IsOptional()
  body: string;
}
