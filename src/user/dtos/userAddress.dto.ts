import {
  IsBoolean,
  IsOptional,
  IsString,
  IsUUID,
} from '@nestjs/class-validator';

export class UserAddressDto {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsString()
  addressName: string;

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
  town: string;

  @IsOptional()
  @IsString()
  county: string;

  @IsOptional()
  @IsString()
  postCode: string;

  @IsBoolean()
  default: boolean;
}
