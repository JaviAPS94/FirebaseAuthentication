import { Test, TestingModule } from 'test/e2e/plans/node_modules/@nestjs/testing';
import { HealthController } from './health.controller';
import {HealthcheckIndicator}  from './health.service';
import { TerminusModule } from '@nestjs/terminus';
import { assert } from 'console';

describe('Health Controller', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TerminusModule],
      controllers: [HealthController],
      providers: [HealthcheckIndicator]
    }).compile();

    healthController = module.get<HealthController>(HealthController);
  });


  it('healthcheck should return status up', async () => {
    const expectedResponse= "{status: 'ok',info: { 'ms-subscriptions': { status: 'up' } },error: {},details: { 'ms-subscriptions': { status: 'up' } }}";
    
    const response= await healthController.healthcheck();
    
    expect(healthController.healthcheck()).toBeCalled;
    assert(response, expectedResponse);
  });
});
