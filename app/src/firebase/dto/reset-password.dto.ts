import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  passwordResetCode: string;

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
  newPassword: string;
}