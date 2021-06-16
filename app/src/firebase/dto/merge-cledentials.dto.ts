import { IsNotEmpty, IsString } from 'class-validator';

export class MergeUserDto {
  @IsNotEmpty()
  @IsString()
  mergeUid: string;
  
  @IsNotEmpty()
  @IsString()
  phone: string;
}