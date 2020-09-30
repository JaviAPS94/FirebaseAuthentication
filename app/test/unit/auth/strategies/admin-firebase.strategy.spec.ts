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

  it('should initialize firebase admin app', async () => {
    const credential = new Credential();
    Object.assign(credential, mockFirebase.credentials[0]);
    const accountId = 1;
    const result = await adminFirebaseStrategy.initializeFirebaseAdminApp(credential, accountId);
    expect(result).toBeDefined();
  });

  it('should not initialize firebase admin app', async () => {
    const credential = new Credential();
    Object.assign(credential, mockFirebase.credentials[1]);
    const accountId = 1;
    try {
      await adminFirebaseStrategy.initializeFirebaseAdminApp(credential, accountId);
    } catch (error) {
      expect(error.message).toContain('InitializeFirebaseAdminApp error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should return existing firebase admin by account app', async () => {
    test();
    const accountId = 1;
    const result = await adminFirebaseStrategy.initializeFirebaseAdminAppByAccount(accountId);
    expect(result).toBeDefined();
  });

  it('should find admin credential by account in db', async () => {
    mockFindAdminCredentialByAccount();
    const credentialResult = new Credential();
    Object.assign(credentialResult, mockFirebase.credentialsResult[0]);

    const accountId = 1;
    const wrapperService = new EntityManagerWrapperService();
    const result = await adminFirebaseStrategy.findAdminCredentialByAccount(accountId, wrapperService);

    expect(result).toEqual(credentialResult);
  });

  it('should throw error when find admin credential by account fails', async () => {
    mockFindAdminCredentialByAccountFailure();
    const accountId = 1;
    const wrapperService = new EntityManagerWrapperService();
    expect.assertions(2);

    try {
      await adminFirebaseStrategy.findAdminCredentialByAccount(accountId, wrapperService);
    } catch (error) {
      expect(error.message).toContain('AdminCredentialByAccount Find error:');
      expect(error).toBeInstanceOf(Error);
    }
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
    //mockExtractTokenFromHeaderFailure();
    const mockRequest = <Request>{};
    try {
      await adminFirebaseStrategy.extractTokenFromHeader(mockRequest);
    } catch (error) {
      expect(error.message).toContain('ExtractTokenFromHeader error:');
      expect(error).toBeInstanceOf(Error);
    }
  })

  const mockFindAdminCredentialByAccount = () => {
    const findAdminCredentialByAccount = EntityManagerWrapperService.prototype.findCrendentialByAccountId = jest.fn();
    findAdminCredentialByAccount.mockReturnValue(mockFirebase.credentialsResult[0]);
  };

  const test = () => {
    const findAdminCredentialByAccount = AdminFirebaseStrategy.prototype.getFirebaseAdminApp = jest.fn();
    findAdminCredentialByAccount.mockReturnValue(admin.apps[0]);
  };

  const mockFindAdminCredentialByAccountFailure = () => {
    const findAdminCredentialByAccount = EntityManagerWrapperService.prototype.findCrendentialByAccountId = jest.fn();
    findAdminCredentialByAccount.mockImplementation(() => { throw new Error('ANY.ERROR') });
  };

  const mockExtractTokenFromHeaderFailure = () => {
    const extractTokenFromHeader = AdminFirebaseStrategy.prototype.extractTokenFromHeader = jest.fn();
    extractTokenFromHeader.mockImplementation(() => { throw new Error('ANY.ERROR') });
  };
});