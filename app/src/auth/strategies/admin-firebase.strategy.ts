import { HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { FirebaseAuthStrategy, FirebaseUser } from '@tfarras/nestjs-firebase-auth';
import { Request } from "express";
import * as admin from 'firebase-admin';
import { ExtractJwt } from 'passport-jwt';
import { Credential } from "../../../src/entity/Credential";
import { EntityManagerWrapperService } from "../../../src/utils/entity-manager-wrapper.service";
import { KrypteringService } from "../../../src/utils/kryptering.service";
import { UNAUTHORIZED } from '../auth.constants';

@Injectable()
export class AdminFirebaseStrategy extends PassportStrategy(FirebaseAuthStrategy, 'firebase') {
  public constructor() {
    super({
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async validate(payload: FirebaseUser): Promise<FirebaseUser> {
    return payload;
  }

  async authenticate(req: Request): Promise<void> {
    try {
      const idToken = await this.extractTokenFromHeader(req);
      const firebaseAdminApp = await this.initializeFirebaseAdminAppByAccount(parseInt(req.header("account")));
      const authentication = await firebaseAdminApp.auth().verifyIdToken(idToken);
      await this.validateDecodedToken(authentication);
    } catch (error) {
      this.fail(error, HttpStatus.UNAUTHORIZED);
    }
  }

  async extractTokenFromHeader(req: Request) {
    try {
      const tokenExtractor = ExtractJwt.fromAuthHeaderAsBearerToken();
      const idToken = tokenExtractor(req);
      return idToken;
    } catch (error) {
      throw new Error("ExtractTokenFromHeader error: " + error.message);
    }
  }

  public async initializeFirebaseAdminAppByAccount(account: number) {
    if (admin.apps.length > 0) {
      let newAdminApp = admin.apps.find(app => app.name === "admin-account-" + account.toString());
      if (!newAdminApp) {
        newAdminApp = await this.getFirebaseAdminApp(account);
      }
      return newAdminApp;
    }

    const firstAdminApp = await this.getFirebaseAdminApp(account);
    return firstAdminApp;
  }

  public async getFirebaseAdminApp(account: number) {
    const connection = new EntityManagerWrapperService();
    const credentialFirstAdminApp = await this.findAdminCredentialByAccount(account, connection);
    const firstAdminApp = await this.initializeFirebaseAdminApp(credentialFirstAdminApp, account);
    return firstAdminApp;
  }

  public async findAdminCredentialByAccount(account: number, connection: EntityManagerWrapperService) {
    try {
      return await connection.findCrendentialByAccountId({
        where: { accountId: `${account}` }
      });
    } catch (error) {
      throw new Error("AdminCredentialByAccount Find error: " + error.message);
    }
  }

  public async initializeFirebaseAdminApp(credential: Credential, account: number) {
    try {
      const krypteringService = new KrypteringService();
      const adminApp = await admin.initializeApp({
        credential: admin.credential.cert({
          projectId: credential.projectId,
          privateKey: (await krypteringService.decrypt(credential.privateKey)).replace(/\\n/g, '\n'),
          clientEmail: credential.clientEmail,
        }),
        databaseURL: credential.databaseUrl
      }, "admin-account-" + account.toString());
      return adminApp;
    } catch (error) {
      throw new Error("InitializeFirebaseAdminApp error: " + error.message);
    }
  }

  public async validateDecodedToken(decodedIdToken: FirebaseUser) {
    const result = await this.validate(decodedIdToken);

    if (result) {
      this.success(result);
    }

    this.fail(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}