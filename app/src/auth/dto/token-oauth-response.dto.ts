import { IsInt, IsObject, IsString } from 'class-validator';

export class TokenOauthResponseDto {
  @IsInt()
  id: string;

  @IsString()
  name: string;

  @IsObject()
  additionalInfo: any;

  @IsString()
  createdAt: string;

  @IsString()
  updateAt: string;

  @IsString()
  deleteAt: string;
}