import { IsInt, IsObject, IsString } from 'class-validator';

export class CredentialResponseDto {
  @IsInt()
  id: number;

  @IsInt()
  accountId: number;

  @IsString()
  projectId: string;

  @IsObject()
  privateKey: {
    iv: string,
    content: string
  };

  @IsString()
  clientEmail: string;

  @IsString()
  databaseUrl: string;

  @IsObject()
  apiKey: {
    iv: string,
    content: string
  };

  @IsString()
  authDomain: string;

  @IsString()
  createdAt: string;

  @IsString()
  updateAt: string;

  @IsString()
  deleteAt: string;
}