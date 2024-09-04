import { IsOptional, IsString } from '@nestjs/class-validator';
import { IsDateString } from 'class-validator';

export class UserDetailsDto {
  // @IsString()
  // id: string;

  // @IsOptional()
  // @IsString()
  // name: string;

  @IsOptional()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  image: string;

  @IsOptional()
  @IsString()
  county: string;

  @IsOptional()
  @IsString()
  displayName: string;

  @IsOptional()
  @IsString()
  firstName: string;

  @IsOptional()
  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  street: string;

  @IsOptional()
  @IsString()
  street2: string;

  @IsOptional()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  town: string;

  //YYYY-MM-DD
  @IsOptional()
  @IsDateString()
  birthDate: string;

  @IsOptional()
  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  mobPhone: string;

  @IsOptional()
  @IsString()
  postCode: string;
}
