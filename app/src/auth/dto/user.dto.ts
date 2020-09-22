import { IsString, IsNotEmpty, IsOptional, IsObject } from 'class-validator';

export class UserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  secret: string;

  @IsOptional()
  @IsObject()
  additionalInfo: any;
}