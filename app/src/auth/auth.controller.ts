import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { ApiBody, ApiHeader, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { FirebaseTokenResponseDto } from './dto/firebase-token-response.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginDto } from './dto/login.dto';
import { TokenOauthResponseDto } from './dto/token-oauth-response.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UserDto } from './dto/user.dto';
import { FirebaseAuthGuard } from './guards/firebase.guards';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Oauth2AuthGuard } from './guards/oauth2.guard';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(Oauth2AuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201, description: 'Token has been successfully generated.', type: LoginResponseDto
  })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('token')
  @ApiHeader({
    name: 'authentication',
    description: 'Bearer token from login oauth',
  })
  @ApiResponse({
    status: 201, description: 'Token has been successfully validated and response current user.', type: TokenOauthResponseDto
  })
  async validateToken(@Request() req) {
    const user: any = await this.authService.getValidatedUserById(req.user.id);
    if (user) {
      return user;
    }
  }

  @UseGuards(FirebaseAuthGuard)
  @Get('firebase-token')
  @ApiHeader({
    name: 'authentication',
    description: 'Bearer token from firebase',
  })
  @ApiResponse({
    status: 201, description: 'Firebase toke has been successfully validated and response current user.', type: FirebaseTokenResponseDto
  })
  async validateFirebaseToken(@Request() req) {
    return await req.user;
  }

  @Post('user')
  @ApiResponse({
    status: 201, description: "User Oauth has been successfully created.", type: UserResponseDto
  })
  async create(@Body() userDto: UserDto) {
    try {
      return await this.authService.getUserRegistered(userDto);
    }
    catch (error) {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'The input data is invalid ' + error.message,
      }, HttpStatus.FORBIDDEN);
    }
  }
}