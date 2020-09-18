import { HealthModule } from './health/health.module';
import { EntityManagerWrapperService } from './utils/entity-manager-wrapper.service';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [HealthModule, TypeOrmModule.forRoot(), AuthModule],
  providers: [EntityManagerWrapperService],
  controllers: []
})
export class AppModule { }
