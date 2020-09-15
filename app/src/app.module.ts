import { Module } from 'test/e2e/plans/node_modules/@nestjs/common';
import { TypeOrmModule } from 'test/e2e/plans/node_modules/@nestjs/typeorm';
import { HealthModule } from './health/health.module';
import { PlanModule } from './plans/plan.module';
import { FamilyPlanService } from './plans/family-plan.service';
import { EntityManagerWrapperService } from './utils/entity-manager-wrapper.service';

@Module({
  imports: [HealthModule, TypeOrmModule.forRoot(), PlanModule],
  providers: [FamilyPlanService, EntityManagerWrapperService],
  controllers: []
})
export class AppModule { }
