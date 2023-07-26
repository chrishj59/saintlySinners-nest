import { IsEmail, IsOptional, IsString } from '@nestjs/class-validator';

export class NotifyEmailDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  text: string;
}

export class InvoiceEmailDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  html: string;
}
