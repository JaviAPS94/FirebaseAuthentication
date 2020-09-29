import { Injectable } from '@nestjs/common';
import * as firebase from 'firebase';
import { Credential } from '../../src/entity/Credential';
import { KrypteringService } from '../../src/utils/kryptering.service';
import { getManager } from 'typeorm';
import { EntityManagerWrapperService } from '../../src/utils/entity-manager-wrapper.service';
import { CredentialDto } from './dto/credential.dto';
import { SignInDto } from './dto/signIn.dto';

@Injectable()
export class FirebaseService {
  constructor() { }

  public async initializeFirebaseAppByAccount(account: number) {
    if (firebase.apps.length > 0) {
      let newApp = firebase.apps.find(app => app.name === "account-" + account.toString());
      if (!newApp) {
        newApp = await this.getFirebaseApp(account);
      }
      return newApp;
    }

    const firstApp = await this.getFirebaseApp(account);
    return firstApp;
  }

  public async getFirebaseApp(account: number) {
    const connection = new EntityManagerWrapperService();
    const credentialFirstAdminApp = await this.findCredentialByAccount(account, connection);
    const firstAdminApp = await this.initializeFirebaseApp(credentialFirstAdminApp, account);
    return firstAdminApp;
  }

  public async initializeFirebaseApp(credential: Credential, account: number) {
    try {
      const krypteringService = new KrypteringService();
      const app = firebase.initializeApp({
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
      const app = await this.initializeFirebaseAppByAccount(account);
      const response = await app.auth().signInWithEmailAndPassword(signInDto.email, signInDto.password);
      return response;
    }
    catch (error) {
      throw new Error("SignIn user error: " + error.message);
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