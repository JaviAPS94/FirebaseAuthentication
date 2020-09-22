import { Injectable } from '@nestjs/common';
import { HealthIndicator, HealthIndicatorResult, HealthCheckError } from '@nestjs/terminus';

@Injectable()
export class HealthcheckIndicator extends HealthIndicator {
  getHealthcheck(): number {
     return 200;
   }

  async isHealthy(): Promise<HealthIndicatorResult>{
    const isHealthy = this.getHealthcheck()==200;

    const result = this.getStatus("ms-subscriptions",isHealthy);
    if (isHealthy){
      return result;
    }
    throw new HealthCheckError('Liveness probe failed', result);
  }
}