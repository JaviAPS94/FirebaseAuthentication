import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';
import { Match } from '../../../src/utils/custom-validations.service';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(7, {
    message: "Password is too short"
  })
  @Matches(/^(?=.*[a-z])/, {
    message: "Password must have minimum one lower case"
  })
  @Matches(/^(?=.*[A-Z])/, {
    message: "Password must have minimum one upper case"
  })
  @Matches(/^(?=.*[0-9])/, {
    message: "Password must have minimum one digit"
  })
  @Matches(new RegExp("^(?=.*[!@#$%^&*()_+\\-=\[\\]{};':\"\\\\|,.<>\\/?])"), {
    message: "Password must contain at least one special character"
  })
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  @Match('password')
  passwordRewrite: string;
}