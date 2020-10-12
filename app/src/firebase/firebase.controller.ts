import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CredentialDto } from './dto/credential.dto';
import { RegisterAuthUserDto } from './dto/register-auth-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/signIn.dto';
import { FirebaseService } from './firebase.service';

@Controller('api/auth')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) { }

  @Post('firebase-credential')
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