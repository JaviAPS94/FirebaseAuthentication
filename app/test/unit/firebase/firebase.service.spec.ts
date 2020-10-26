import { Test, TestingModule } from '@nestjs/testing';
import * as firebase from "firebase";
import { ChangePasswordDto } from '../../../src/firebase/dto/change-password.dto';
import { AccountModule } from '../../../src/account/account.module';
import { AccountService } from '../../../src/account/account.service';
import { CLIENT } from '../../../src/constants';
import { Credential } from '../../../src/entity/Credential';
import { RegisterAuthUserDto } from '../../../src/firebase/dto/register-auth-user.dto';
import { ResetPasswordDto } from '../../../src/firebase/dto/reset-password.dto';
import { SignInDto } from '../../../src/firebase/dto/signIn.dto';
import { FirebaseController } from '../../../src/firebase/firebase.controller';
import { FirebaseService } from '../../../src/firebase/firebase.service';
import { EntityManagerWrapperService } from '../../../src/utils/entity-manager-wrapper.service';
import { mockFirebase } from '../../mock-firebase-data';

jest.mock('../../../src/utils/entity-manager-wrapper.service');

describe('FirebaseService', () => {
  let firebaseService: FirebaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountModule],
      controllers: [FirebaseController],
      exports: [FirebaseService],
      providers: [FirebaseService]
    }).compile();

    firebaseService = module.get<FirebaseService>(FirebaseService);
  });

  it('should register crendential in db', async () => {
    mockCreateCredentialSuccessful();
    const dataToCreate = mockFirebase.credentialToCreate[0];
    const expectedResult = mockFirebase.credentialsResult[0];
    const wrapperService = new EntityManagerWrapperService();
    const result = await firebaseService.saveCredential(dataToCreate, wrapperService);
    expect(result).toEqual(expectedResult);
  });

  it('should throw error when create fails', async () => {
    mockCreateCredentialFailure();
    const dataToCreate = mockFirebase.credentialToCreate[0];
    const wrapperService = new EntityManagerWrapperService();
    expect.assertions(2);

    try {
      await firebaseService.saveCredential(dataToCreate, wrapperService);
    } catch (error) {
      expect(error.message).toContain('Create Credential Database Error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should find credential by account in db', async () => {
    mockFindCredentialByAccount();
    const credentialResult = new Credential();
    Object.assign(credentialResult, mockFirebase.credentialsResult[0]);

    const accountId = 1;
    const wrapperService = new EntityManagerWrapperService();
    const result = await firebaseService.findCredentialByAccount(accountId, wrapperService);

    expect(result).toEqual(credentialResult);
  });

  it('should throw error when find credential by account fails', async () => {
    mockFindCredentialByAccountFailure();
    const accountId = 1;
    const wrapperService = new EntityManagerWrapperService();
    expect.assertions(2);

    try {
      await firebaseService.findCredentialByAccount(accountId, wrapperService);
    } catch (error) {
      expect(error.message).toContain('CredentialByAccount Find error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should initialize firebase app', async () => {
    const credential = new Credential();
    Object.assign(credential, mockFirebase.credentials[0]);
    const accountId = 1;
    const result = await firebaseService.initializeFirebaseApp(credential, accountId, CLIENT);
    expect(result).toBeDefined();
  });

  it('should not initialize firebase admin app', async () => {
    const credential = new Credential();
    Object.assign(credential, mockFirebase.credentials[1]);
    const accountId = 1;
    try {
      await firebaseService.initializeFirebaseApp(credential, accountId, CLIENT);
    } catch (error) {
      expect(error.message).toContain('InitializeFirebaseApp error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should signIn user in firebase', async () => {
    const accountId = 1;
    const signInDto = new SignInDto();
    Object.assign(signInDto, mockFirebase.signIn[0]);

    const result = await firebaseService.signIn(signInDto, accountId);
    expect(result).toBeDefined();
  }, 30000);

  it('should not signIn user in firebase', async () => {
    const accountId = 1;
    const signInDto = new SignInDto();
    Object.assign(signInDto, mockFirebase.signIn[1]);

    try {
      await firebaseService.signIn(signInDto, accountId);
    } catch (error) {
      expect(error.message).toContain('SignIn user error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should not reset password in firebase', async () => {
    const accountId = 1;
    const resetPasswordDto = new ResetPasswordDto();
    Object.assign(resetPasswordDto, mockFirebase.resetPassword[0]);

    try {
      await firebaseService.resetPassword(resetPasswordDto, accountId);
    } catch (error) {
      expect(error.message).toContain('ResetPassword error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should not change password in firebase', async () => {
    const accountId = 1;
    const uid = "uidtest";
    const changePasswordDto = new ChangePasswordDto();
    Object.assign(changePasswordDto, mockFirebase.changePassword[0]);

    try {
      await firebaseService.changePassword(changePasswordDto, accountId, uid);
    } catch (error) {
      expect(error.message).toContain('ChangePassword error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should register auth user in firebase', async () => {
    mockSignIn();
    const accountId = 1;
    const registerAuthUserDto = new RegisterAuthUserDto();
    Object.assign(registerAuthUserDto, mockFirebase.registerAuthUser[0]);

    try {
      await firebaseService.registerAuthUser(registerAuthUserDto, accountId);
    } catch (error) {
      expect(error.message).toContain('RegisterAuthUser error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should not register token in blacklist', async () => {
    try {
      const accountId = 1;
      await firebaseService.registerTokenInBlackList("Bearer 1234", accountId);
    } catch (error) {
      expect(error.message).toContain('RegisterTokenInBlackList error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  it('should not delete expired token', async () => {
    try {
      const accountId = 1;
      await firebaseService.deleteExpiredToken(accountId);
    } catch (error) {
      expect(error.message).toContain('DeleteExpiredToken error:');
      expect(error).toBeInstanceOf(Error);
    }
  });

  const mockSignIn = () => {
    const signIn = FirebaseService.prototype.initializeFirebaseAppByAccount = jest.fn();
    signIn.mockReturnValue(firebase.app[0]);
  };

  const mockCreateCredentialSuccessful = () => {
    const findAccountById = AccountService.prototype.findById = jest.fn();
    findAccountById.mockReturnValue(mockFirebase.accounts[0]);

    const returnedCrendential = new Credential();
    Object.assign(returnedCrendential, mockFirebase.credentialsResult[0]);

    const save = EntityManagerWrapperService.prototype.save = jest.fn();
    save.mockReturnValue(returnedCrendential);
  };

  const mockCreateCredentialFailure = () => {
    const save = EntityManagerWrapperService.prototype.save = jest.fn();
    save.mockImplementation(() => { throw new Error('ANY.ERROR') });
  };

  const mockFindCredentialByAccountFailure = () => {
    const findCredentialByAccount = EntityManagerWrapperService.prototype.findCrendentialByAccountId = jest.fn();
    findCredentialByAccount.mockImplementation(() => { throw new Error('ANY.ERROR') });
  };

  const mockFindCredentialByAccount = () => {
    const findCredentialByAccount = EntityManagerWrapperService.prototype.findCrendentialByAccountId = jest.fn();
    findCredentialByAccount.mockReturnValue(mockFirebase.credentialsResult[0]);
  };
});
