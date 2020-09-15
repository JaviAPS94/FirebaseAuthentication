import { Module } from 'test/e2e/plans/node_modules/@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { HealthcheckIndicator} from './health.service';

@Module({
  imports: [TerminusModule],
  controllers: [HealthController],
  providers: [HealthcheckIndicator],
})
export class HealthModule{}