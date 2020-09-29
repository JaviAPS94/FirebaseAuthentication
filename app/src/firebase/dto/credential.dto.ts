import { IsString, IsNotEmpty, IsOptional, IsObject, IsEmail, IsIn, IsInt } from 'class-validator';

export class CredentialDto {
  @IsNotEmpty()
  @IsInt()
  accountId: number;

  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  privateKey: string;

  @IsNotEmpty()
  @IsString()
  clientEmail: string;

  @IsNotEmpty()
  @IsString()
  databaseUrl: string;

  @IsNotEmpty()
  @IsString()
  apiKey: string;

  @IsNotEmpty()
  @IsString()
  authDomain: string;
}