import { HealthModule } from './health/health.module';
import { EntityManagerWrapperService } from './utils/entity-manager-wrapper.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FirebaseAdminCoreModule } from '@tfarras/nestjs-firebase-admin';
import * as admin from 'firebase-admin'
import { UsersModule } from './users/users.module';
@Module({
  imports: [HealthModule, TypeOrmModule.forRoot(), AuthModule, UsersModule,
    FirebaseAdminCoreModule.forRootAsync({
      useFactory: () => ({
        credential: admin.credential.cert({
          projectId: process.env.PROJECT_ID,
          privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.CLIENT_EMAIL,
        }),
        databaseURL: "https://inmedical-dev.firebaseio.com"
      })
    }),
  ],
  providers: [EntityManagerWrapperService],
  controllers: []
})
export class AppModule { }
