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
import { ApiHeader, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserDto } from './dto/user.dto';
import { FirebaseAuthGuard } from './guards/firebase.guards';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Oauth2AuthGuard } from './guards/oauth2.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @UseGuards(Oauth2AuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('token')
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
    status: 200, description: 'The record has been successfully created.', schema: {
      type: "object", properties: {
        name: { type: 'string'}
      }
    }
  })
  async validateFirebaseToken(@Request() req) {
    return await req.user;
  }

  @Post('user')
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