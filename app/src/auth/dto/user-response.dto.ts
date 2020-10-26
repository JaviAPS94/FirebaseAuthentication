import { IsInt, IsObject, IsString } from 'class-validator';

export class UserResponseDto {
  @IsInt()
  id: string;

  @IsString()
  name: string;

  @IsString()
  secret: string;

  @IsObject()
  additionalInfo: any;

  @IsString()
  createdAt: string;

  @IsString()
  updateAt: string;

  @IsString()
  deleteAt: string;
}