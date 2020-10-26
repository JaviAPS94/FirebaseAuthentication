import { IsObject, IsString } from 'class-validator';

export class SignInResponseDto {

  @IsObject()
  user: {
    uid: string,
    displayName: string,
    photoURL: string | null,
    email: string,
    emailVerified: boolean,
    phoneNumber: string | null,
    isAnonymous: boolean,
    tenantId: number | null,
    providerData: any [],
    apiKey: string,
    appName: string,
    authDomain: string,
    stsTokenManager: {
      apiKey: string,
      refreshToken: string,
      accessToken: string,
      expirationTime: number
    },
    redirectEventId: string | null,
    lastLoginAt: string,
    createdAt: string,
    multiFactor: {
      enrolledFactors: any []
    }
  };

  @IsString()
  credential: string | null;

  @IsObject()
  additionalUserInfo: {
    providerId: string,
    isNewUser: boolean
  };

  @IsString()
  operationType: string;
}