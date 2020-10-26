import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { FirebaseModule } from '../../src/firebase/firebase.module';
import { UsersModule } from '../../src/users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AdminFirebaseStrategy } from './strategies/admin-firebase.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { Oauth2Strategy } from './strategies/oauth2.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    FirebaseModule,
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
})
export class AuthModule { }
