import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';
import * as admin from "firebase-admin";
import { AuthController } from '../../../../src/auth/auth.controller';
import { AuthService } from '../../../../src/auth/auth.service';
import { AdminFirebaseStrategy } from '../../../../src/auth/strategies/admin-firebase.strategy';
import { JwtStrategy } from '../../../../src/auth/strategies/jwt.strategy';
import { Oauth2Strategy } from '../../../../src/auth/strategies/oauth2.strategy';
import { Credential } from '../../../../src/entity/Credential';
import { UsersModule } from '../../../../src/users/users.module';
import { EntityManagerWrapperService } from '../../../../src/utils/entity-manager-wrapper.service';
import { mockFirebase } from '../../../mock-firebase-data';

jest.mock('../../../../src/utils/entity-manager-wrapper.service');

describe('Admin firebase Strategy', () => {
  let adminFirebaseStrategy: AdminFirebaseStrategy;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
          useFactory: async () => ({
            secret: process.env.JWT_SECRET_KEY,
            signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME }
          })
        })
      ],
      controllers: [AuthController],
      providers: [AuthService, Oauth2Strategy, JwtStrategy, AdminFirebaseStrategy],
      exports: [AdminFirebaseStrategy]
    }).compile();

    adminFirebaseStrategy = module.get<AdminFirebaseStrategy>(AdminFirebaseStrategy);
  });

  it('should return a firebase token from request', async () => {
    const mockRequest = <Request>{
      headers: {
        authorization: "Bearer test",
      }
    };
    const result = await adminFirebaseStrategy.extractTokenFromHeader(mockRequest);
    expect(result).toBeDefined();
  })

  it('should not return a firebase token from request', async () => {
    const mockRequest = <Request>{};
    try {
      await adminFirebaseStrategy.extractTokenFromHeader(mockRequest);
    } catch (error) {
      expect(error.message).toContain('ExtractTokenFromHeader error:');
      expect(error).toBeInstanceOf(Error);
    }
  })
});