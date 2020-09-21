import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2-client-password';
import { EntityManagerWrapperService } from "../../../src/utils/entity-manager-wrapper.service";
import { getManager } from "typeorm";
import { AuthService } from '../auth.service';

@Injectable()
export class Oauth2Strategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(userId: number, userSecret: string): Promise<any> {
    const wraperService = new EntityManagerWrapperService(getManager());
    const user = await this.authService.validateUser(userId, userSecret, wraperService);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}