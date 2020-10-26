import { IsNotEmpty, IsString } from "class-validator";

export class RegisterAuthUserWithPhoneNumberDto {
  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsString()
  reCaptchaToken: string;
}