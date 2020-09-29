import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { HealthModule } from './health/health.module';
import { UsersModule } from './users/users.module';
import { EntityManagerWrapperService } from './utils/entity-manager-wrapper.service';
@Module({
  imports: [HealthModule, TypeOrmModule.forRoot(), AuthModule, UsersModule, FirebaseModule],
  providers: [EntityManagerWrapperService],
  controllers: []
})
export class AppModule { }
