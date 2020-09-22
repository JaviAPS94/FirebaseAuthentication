import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2-client-password';
import { AuthService } from '../auth.service';

@Injectable()
export class Oauth2Strategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(userId: number, userSecret: string): Promise<any> {
    const user = await this.authService.getValidatedUser(userId, userSecret);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}