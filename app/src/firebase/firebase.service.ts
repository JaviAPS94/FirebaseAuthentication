import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase';
import * as firebaseAdmin from 'firebase-admin';
import * as _ from 'lodash';
import * as moment from 'moment';
import { getManager } from 'typeorm';
import { AccountService } from '../../src/account/account.service';
import { ADMIN, CLIENT } from '../../src/constants';
import { Credential } from '../../src/entity/Credential';
import { EntityManagerWrapperService } from '../../src/utils/entity-manager-wrapper.service';
import { KrypteringService } from '../../src/utils/kryptering.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CredentialDto } from './dto/credential.dto';
import { RegisterAuthUserWithPhoneNumberDto } from './dto/register-auth-user-phone-number';
import { RegisterAuthUserDto } from './dto/register-auth-user.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/signIn.dto';
import { ICreateFirebaseAuthUser } from './interfaces/create-firebase-auth-user.interface';

@Injectable()
export class FirebaseService {
  constructor(private readonly accountService: AccountService) { }

  public async initializeFirebaseAppByAccount(account: number, firebaseTypeApp: string) {
    const firebaseAppsLength = (firebaseTypeApp === "admin") ? firebaseAdmin.apps.length : firebase.apps.length;

    if (firebaseAppsLength > 0) {
      let newApp = (firebaseTypeApp === "admin") ? firebaseAdmin.apps.find(app => app.name === "admin-account-" + account.toString()) :
        firebase.apps.find(app => app.name === "account-" + account.toString());
      if (!newApp) {
        newApp = await this.getFirebaseApp(account, firebaseTypeApp);
      }
      return newApp;
    }

    const firstApp = await this.getFirebaseApp(account, firebaseTypeApp);
    return firstApp;
  }

  public async getFirebaseApp(account: number, firebaseTypeApp: string) {
    const connection = new EntityManagerWrapperService();
    const credentialFirstAdminApp = await this.findCredentialByAccount(account, connection);
    const firstAdminApp = await this.initializeFirebaseApp(credentialFirstAdminApp, account, firebaseTypeApp);
    return firstAdminApp;
  }

  public async initializeFirebaseApp(credential: Credential, account: number, firebaseTypeApp: string) {
    try {
      const krypteringService = new KrypteringService();
      const app = (firebaseTypeApp === "admin") ?
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert({
            projectId: credential.projectId,
            privateKey: (await krypteringService.decrypt(credential.privateKey)).replace(/\\n/g, '\n'),
            clientEmail: credential.clientEmail,
          }),
          databaseURL: credential.databaseUrl
        }, "admin-account-" + account.toString()) :
        firebase.initializeApp({
          apiKey: await krypteringService.decrypt(credential.apiKey),
          authDomain: credential.authDomain,
          databaseURL: credential.databaseUrl
        }, "account-" + account.toString());
      return app;
    } catch (error) {
      throw new Error("InitializeFirebaseApp error: " + error.message);
    }
  }

  public async findCredentialByAccount(account: number, connection: EntityManagerWrapperService) {
    try {
      return await connection.findCrendentialByAccountId({
        where: { accountId: `${account}` }
      });
    }
    catch (error) {
      console.log("ERROR: CredentialByAccount Find error: " + error.message);
      throw new Error("CredentialByAccount Find error: " + error.message);
    }
  }

  public async signIn(signInDto: SignInDto, account: number) {
    try {
      const app = await this.initializeFirebaseAppByAccount(account, CLIENT) as firebase.app.App;
      const response = await app.auth().signInWithEmailAndPassword(signInDto.email, signInDto.password);
      return response;
    }
    catch (error) {
      throw new Error("SignIn user error: " + error.message);
    }
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto, account: number) {
    try {
      const app = await this.initializeFirebaseAppByAccount(account, CLIENT) as firebase.app.App;
      const response = await app.auth().confirmPasswordReset(resetPasswordDto.passwordResetCode, resetPasswordDto.newPassword);
      return response;
    }
    catch (error) {
      throw new Error("ResetPassword error: " + error.message);
    }
  }

  public async changePassword(changePasswordDto: ChangePasswordDto, account: number, uid: string) {
    try {
      const app = await this.initializeFirebaseAppByAccount(account, ADMIN) as firebaseAdmin.app.App;
      const response = await app.auth().updateUser(uid, {
        password: changePasswordDto.password
      });
      return response;
    }
    catch (error) {
      throw new Error("ChangePassword error: " + error.message);
    }
  }

  public async registerAuthUser(registerAuthUserDto: RegisterAuthUserDto, account: number) {
    try {
      const app = await this.initializeFirebaseAppByAccount(account, ADMIN) as firebaseAdmin.app.App;
      const iCreateFirebaseAuthUser: ICreateFirebaseAuthUser = {
        email: registerAuthUserDto.email,
        emailVerified: false,
        password: registerAuthUserDto.password,
        disabled: false
      }
      const response = await app.auth().createUser(iCreateFirebaseAuthUser);
      return response;
    }
    catch (error) {
      throw new Error("RegisterAuthUser error: " + error.message);
    }
  }

  public async registerTokenInBlackList(authorization: string, account: number) {
    try {
      const idToken = authorization.split('Bearer ')[1];
      const app = await this.initializeFirebaseAppByAccount(account, ADMIN) as firebaseAdmin.app.App;
      const decodedToken = await app.auth().verifyIdToken(idToken, true);
      const { exp: expiredAt } = decodedToken;
      const recordSaved = await app.database().ref("blacklist/tokens").push({ idToken, expiredAt });
      return recordSaved.toJSON();
    }
    catch (error) {
      throw new Error("RegisterTokenInBlackList error: " + error.message);
    }
  }

  public async deleteExpiredToken(account: number) {
    try {
      const app = await this.initializeFirebaseAppByAccount(account, ADMIN) as firebaseAdmin.app.App;
      const snapshot = await app.database().ref("blacklist/tokens")
        .orderByChild("expiredAt")
        .endAt(moment().unix())
        .once('value');
      const tokens = {};
      snapshot.forEach(child => tokens[child.key] = null);
      await app.database().ref("blacklist/tokens").update(tokens);
    }
    catch (error) {
      throw new Error("DeleteExpiredToken error: " + error.message);
    }
  }

  async getCrendentialCreated(credential: CredentialDto) {
    const wraperService = new EntityManagerWrapperService(getManager());
    return await this.saveCredential(credential, wraperService);
  }

  async saveCredential(credential: CredentialDto, connection: EntityManagerWrapperService) {
    try {
      const krypteringService = new KrypteringService();
      const credentialToCreate = await connection.findCrendentialByAccountId({
        where: { accountId: `${credential.accountId}` }
      }) ?? new Credential();
      Object.assign(credentialToCreate, credential);
      const account = await this.accountService.findById(credential.accountId, connection);
      if (_.isEmpty(account)) {
        throw new Error('Credential needs a VALID accountId');
      }
      credentialToCreate.privateKey = await krypteringService.encrypt(credential.privateKey);
      credentialToCreate.apiKey = await krypteringService.encrypt(credential.apiKey);
      return await connection.save(credentialToCreate);
    }
    catch (error) {
      console.log("ERROR: Create Credential Database Error: " + error.message);
      throw new Error("Create Credential Database Error: " + error.message);
    }
  }
}