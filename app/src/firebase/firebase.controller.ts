import {
  Body,
  Controller,
  Headers,
  HttpException,
  HttpStatus,
  Post
} from '@nestjs/common';
import { CredentialDto } from './dto/credential.dto';
import { SignInDto } from './dto/signIn.dto';
import { FirebaseService } from './firebase.service';

@Controller('auth')
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
}