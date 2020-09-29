import { IsString, IsNotEmpty, IsOptional, IsObject, IsEmail } from 'class-validator';

export class SignInDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}