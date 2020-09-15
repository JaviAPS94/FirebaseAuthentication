import { Controller, Get , Injectable } from 'test/e2e/plans/node_modules/@nestjs/common';
import {  HealthCheckService , HealthCheck} from '@nestjs/terminus';
import { HealthcheckIndicator } from './health.service';

@Controller('health')
@Injectable()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private healthcheckIndicator: HealthcheckIndicator
  ) {}

    @Get()
    @HealthCheck()
    healthcheck() {
      return this.health.check([
        async () => this.healthcheckIndicator.isHealthy()
      ]);
    }
}
