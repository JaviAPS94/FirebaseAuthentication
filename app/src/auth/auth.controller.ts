import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
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
}