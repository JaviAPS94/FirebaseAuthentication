import { HttpStatus, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { FirebaseAuthStrategy, FirebaseUser } from '@tfarras/nestjs-firebase-auth';
import { Request } from "express";
import * as admin from 'firebase-admin';
import { ExtractJwt } from 'passport-jwt';
import { FirebaseService } from "../../../src/firebase/firebase.service";
import { ADMIN, UNAUTHORIZED } from '../../constants';

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
      const firebaseService = new FirebaseService();
      const idToken = await this.extractTokenFromHeader(req);
      const firebaseApp = await firebaseService.initializeFirebaseAppByAccount(parseInt(req.header("account")), ADMIN) as admin.app.App;
      const authentication = await firebaseApp.auth().verifyIdToken(idToken);
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

  public async validateDecodedToken(decodedIdToken: FirebaseUser) {
    const result = await this.validate(decodedIdToken);

    if (result) {
      this.success(result);
    }

    this.fail(UNAUTHORIZED, HttpStatus.UNAUTHORIZED);
  }
}