import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ChangePasswordDto } from '../../../src/firebase/dto/change-password.dto';
import { AccountModule } from '../../../src/account/account.module';
import { CredentialDto } from '../../../src/firebase/dto/credential.dto';
import { RegisterAuthUserDto } from '../../../src/firebase/dto/register-auth-user.dto';
import { ResetPasswordDto } from '../../../src/firebase/dto/reset-password.dto';
import { SignInDto } from '../../../src/firebase/dto/signIn.dto';
import { FirebaseController } from '../../../src/firebase/firebase.controller';
import { FirebaseService } from '../../../src/firebase/firebase.service';
import { mockFirebase } from '../../../test/mock-firebase-data';
import { mockUsers } from '../../mock-user-data';

describe('Firebase Controller', () => {
  let firebaseController: FirebaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AccountModule],
      controllers: [FirebaseController],
      exports: [FirebaseService],
      providers: [FirebaseService]
    }).compile();

    firebaseController = module.get<FirebaseController>(FirebaseController);
  });

  it('POST should return 200 when data to post is valid', async () => {
    const createCredential = FirebaseService.prototype.getCrendentialCreated = jest.fn();
    createCredential.mockReturnValue(mockFirebase.credentialsResult[0]);

    const credentialDto = new CredentialDto();
    Object.assign(credentialDto, mockFirebase.credentialToCreate[0]);
    const returnedValue = await firebaseController.createFirebaseCredential(credentialDto);
    const expectedResult = mockFirebase.credentialsResult[0];
    expect(returnedValue).toEqual(expectedResult);
  });

  it('POST should return 403 when data to post is invalid', async () => {
    const createCredential = FirebaseService.prototype.getCrendentialCreated = jest.fn();
    createCredential.mockImplementation(() => {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred creating credential',
      }, HttpStatus.FORBIDDEN);
    });
    const credentialDto = new CredentialDto();
    Object.assign(credentialDto, mockUsers.usersCreate);

    try {
      await firebaseController.createFirebaseCredential(credentialDto);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('An error ocurred creating credential');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }

  });

  it('POST should return 200 when signIn is ok', async () => {
    const signIn = FirebaseService.prototype.signIn = jest.fn();
    signIn.mockReturnValue(mockFirebase.signInUser[0]);

    const accountId = 1;
    const signInDto = new SignInDto();
    Object.assign(signInDto, mockFirebase.signIn[0]);
    const returnedValue = await firebaseController.signIn(signInDto, accountId);
    const expectedResult = mockFirebase.signInUser[0];
    expect(returnedValue).toEqual(expectedResult);
  });

  it('POST should return 403 when signIn is wrong', async () => {
    const signIn = FirebaseService.prototype.signIn = jest.fn();
    signIn.mockImplementation(() => {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred signIn user',
      }, HttpStatus.FORBIDDEN);
    });
    const accountId = 1;
    const signInDto = new SignInDto();
    Object.assign(signInDto, mockFirebase.signIn[0]);

    try {
      await firebaseController.signIn(signInDto, accountId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('An error ocurred signIn user');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }
  });

  it('POST should return 403 when reset password fail', async () => {
    const resetPassword = FirebaseService.prototype.resetPassword = jest.fn();
    resetPassword.mockImplementation(() => {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred reset user password',
      }, HttpStatus.FORBIDDEN);
    });
    const accountId = 1;
    const resetPasswordDto = new ResetPasswordDto();
    Object.assign(resetPasswordDto, mockFirebase.resetPassword[0]);

    try {
      await firebaseController.resetPassword(resetPasswordDto, accountId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('An error ocurred reset user password');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }
  });

  it('POST should return 403 when register auth user fail', async () => {
    const registerAuthUser = FirebaseService.prototype.registerAuthUser = jest.fn();
    registerAuthUser.mockImplementation(() => {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred register auth user',
      }, HttpStatus.FORBIDDEN);
    });
    const accountId = 1;
    const registerAuthUserDto = new RegisterAuthUserDto();
    Object.assign(registerAuthUserDto, mockFirebase.registerAuthUser[0]);

    try {
      await firebaseController.registerAuthUser(registerAuthUserDto, accountId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('An error ocurred register auth user');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }
  });

  it('POST should return 403 when register token in blacklist fail', async () => {
    const registerTokenInBlackList = FirebaseService.prototype.registerTokenInBlackList = jest.fn();
    registerTokenInBlackList.mockImplementation(() => {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred register token in blacklist',
      }, HttpStatus.FORBIDDEN);
    });
    const accountId = 1;

    try {
      await firebaseController.registerTokenInBlackList("Beader 1234", accountId);
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('An error ocurred register token in blacklist');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }
  });

  it('POST should return 403 when change user password fail', async () => {
    const changePassword = FirebaseService.prototype.changePassword = jest.fn();
    changePassword.mockImplementation(() => {
      throw new HttpException({
        status: HttpStatus.FORBIDDEN,
        error: 'An error ocurred change user password',
      }, HttpStatus.FORBIDDEN);
    });
    const accountId = 1;
    const changePasswordDto = new ChangePasswordDto();
    Object.assign(changePasswordDto, mockFirebase.changePassword[0]);

    try {
      await firebaseController.changePassword(changePasswordDto, accountId, "uidtest");
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException);
      expect(error.response.error).toContain('An error ocurred change user password');
      expect(error.status).toBe(HttpStatus.FORBIDDEN);
    }
  });
});
