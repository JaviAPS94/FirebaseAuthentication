import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { getManager } from 'typeorm';
import { EntityManagerWrapperService } from '../../src/utils/entity-manager-wrapper.service';

import { User } from '../entity/User';
import { UsersService } from '../users/users.service';
import { UserDto } from './dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) { }

  async validateUser(userId: number, secret: string, connection: EntityManagerWrapperService): Promise<any> {
    const user = await this.usersService.findUserById(userId, connection);
    if (user && await bcrypt.compare(secret, user.secret)) {
      delete user.secret;
      return user;
    }

    return null;
  }

  async getValidatedUserById(userId: number): Promise<any> {
    const wraperService = new EntityManagerWrapperService(getManager());
    return await this.validateUserById(userId, wraperService);
  }

  async validateUserById(userId: number, connection: EntityManagerWrapperService): Promise<any> {
    const user = await this.usersService.findUserById(userId, connection);
    if (user) {
      delete user.secret;
      return user;
    }
  }

  async login(user: User) {
    const payload = { ...user };
    return {
      accessToken: this.jwtService.sign(payload)
    };
  }

  async registerUser(user: UserDto) {
    const userToCreate = new User();
    Object.assign(userToCreate, user);
    const wraperService = new EntityManagerWrapperService(getManager());
    userToCreate.secret = await bcrypt.hash(user.secret, 10);
    return await this.usersService.save(userToCreate, wraperService);
  }
}
