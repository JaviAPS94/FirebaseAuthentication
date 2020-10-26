import { IsBoolean, IsNumber, IsObject, IsString } from 'class-validator';

export class FirebaseTokenResponseDto {
  @IsString()
  iss: string;

  @IsString()
  aud: string;

  @IsNumber()
  auth_time: number;

  @IsString()
  user_id: string;

  @IsString()
  sub: string;

  @IsNumber()
  iat: number;

  @IsNumber()
  exp: number;

  @IsString()
  email: string;

  @IsBoolean()
  email_verified: boolean;

  @IsObject()
  firebase: any;

  @IsString()
  uid: string;
}