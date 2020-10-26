import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { FirebaseModule } from './firebase/firebase.module';
import { HealthModule } from './health/health.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';
import { EntityManagerWrapperService } from './utils/entity-manager-wrapper.service';
@Module({
  imports: [HealthModule, TypeOrmModule.forRoot(), AuthModule, UsersModule, FirebaseModule, ScheduleModule.forRoot(), TasksModule],
  providers: [EntityManagerWrapperService],
  controllers: []
})
export class AppModule { }
