import { IsNumber, IsOptional, IsString } from 'class-validator';

export class ItemDto {
  @IsOptional()
  @IsNumber()
  id: number;

  @IsString()
  name: string;
  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  image: string;
}
