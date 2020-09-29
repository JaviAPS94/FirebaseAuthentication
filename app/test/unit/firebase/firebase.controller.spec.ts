import { HttpException, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { SignInDto } from '../../../src/firebase/dto/signIn.dto';
import { CredentialDto } from '../../../src/firebase/dto/credential.dto';
import { FirebaseController } from '../../../src/firebase/firebase.controller';
import { FirebaseService } from '../../../src/firebase/firebase.service';
import { mockFirebase } from '../../../test/mock-firebase-data';
import { mockUsers } from '../../mock-user-data';

describe('Firebase Controller', () => {
  let firebaseController: FirebaseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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
});
