import { Test, TestingModule } from 'test/e2e/plans/node_modules/@nestjs/testing';
import { INestApplication } from 'test/e2e/plans/node_modules/@nestjs/common';
import * as request from 'test/e2e/plans/node_modules/supertest';
import { HealthModule } from '../../src/health/health.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [HealthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
  });
});
