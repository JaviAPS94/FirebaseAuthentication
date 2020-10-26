import { IsArray, IsBoolean, IsObject, IsString } from 'class-validator';

export class RegisterFirebaseUserResponseDto {
  @IsString()
  uid: string;

  @IsString()
  email: string;

  @IsBoolean()
  emailVerified: boolean;

  @IsBoolean()
  disabled: boolean;

  @IsObject()
  metadata: {
    lastSignInTime: string | null,
    creationTime: string
  };

  @IsString()
  tokensValidAfterTime: string;

  @IsArray()
  providerData: any[];
}