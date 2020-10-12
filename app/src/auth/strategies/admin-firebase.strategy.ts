import { HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { FirebaseAuthStrategy, FirebaseUser } from '@tfarras/nestjs-firebase-auth';
import { Request } from "express";
import * as admin from 'firebase-admin';
import { ExtractJwt } from 'passport-jwt';
import { FirebaseService } from "../../../src/firebase/firebase.service";
import { ADMIN } from '../../constants';

@Injectable()
export class AdminFirebaseStrategy extends PassportStrategy(FirebaseAuthStrategy, 'firebase') {
  public constructor(private readonly firebaseService: FirebaseService) {
    super({
      extractor: ExtractJwt.fromAuthHeaderAsBearerToken()
    });
  }

  async authenticate(req: Request): Promise<void> {
    try {
      const idToken = await this.extractTokenFromHeader(req);
      const firebaseApp = await this.firebaseService.initializeFirebaseAppByAccount(parseInt(req.header("account")), ADMIN) as admin.app.App;
      const authentication = await firebaseApp.auth().verifyIdToken(idToken);
      await this.tokenIsBlackListed(idToken, firebaseApp);
      this.success(authentication);
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

  public async tokenIsBlackListed(idToken: string, firebaseAdminApp: admin.app.App) {
    const result = await firebaseAdminApp.database().ref("blacklist/tokens").orderByChild("idToken").equalTo(idToken)
      .once("value");
    const isBlackListed = (result.numChildren() > 0);
    if (isBlackListed) {
      throw new Error("tokenIsBlackListed");
    }
  }
}