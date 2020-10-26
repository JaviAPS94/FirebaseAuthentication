import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CredentialDto } from './dto/credential.dto';
import { CredentialResponseDto } from './dto/crendential-response.dto';
import { RegisterAuthUserDto } from './dto/register-auth-user.dto';
import { RegisterFirebaseUserResponseDto } from './dto/register-firebase-user-response.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInResponseDto } from './dto/signIn-response.dto';
import { SignInDto } from './dto/signIn.dto';
import { FirebaseService } from './firebase.service';

@Controller('api/auth')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) { }

  @Post('firebase-credential')
  @ApiResponse({
    status: 201, description: 'Credential has been successfully created.', type: CredentialResponseDto
  })
  async createFirebaseCredential(@Body() credential: CredentialDto) {
    try {
      return await this.firebaseService.getCrendentialCreated(credential);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred creating credential ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
  }

  @Post('signIn')
  @ApiResponse({
    status: 201, description: 'SignIn has been successfully.', type: SignInResponseDto
  })
  async signIn(@Body() signInDto: SignInDto, @Headers('account') account: number) {
    try {
      return await this.firebaseService.signIn(signInDto, account);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred signIn user ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
  }

  @Post('resetPassword')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto, @Headers('account') account: number) {
    try {
      return await this.firebaseService.resetPassword(resetPasswordDto, account);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred reset user password: ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
  }

  @Post('register')
  @ApiResponse({
    status: 201, description: 'Register has been successfully.', type: RegisterFirebaseUserResponseDto
  })
  async registerAuthUser(@Body() registerAuthUserDto: RegisterAuthUserDto, @Headers('account') account: number) {
    try {
      return await this.firebaseService.registerAuthUser(registerAuthUserDto, account);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred register auth user: ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
  }

  @Post('changePassword')
  @ApiResponse({
    status: 201, description: 'Change password has been successfully.', type: RegisterFirebaseUserResponseDto
  })
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Headers('account') account: number, @Headers('uid') uid: string) {
    try {
      return await this.firebaseService.changePassword(changePasswordDto, account, uid);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred change user password: ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
  }

  @Post('blackList/token')
  @ApiResponse({
    status: 201, description: 'Token has been successfully registered in black list.', schema: {
      type: "string"
    }
  })
  async registerTokenInBlackList(@Headers('authorization') authorization: string, @Headers('account') account: number) {
    try {
      return await this.firebaseService.registerTokenInBlackList(authorization, account);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred register token in blacklist: ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
  }
}