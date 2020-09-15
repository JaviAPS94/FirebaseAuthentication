import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { PlanModule } from '../../../src/plans/plan.module';
import { SubscriptionsModule } from '../../../src/subscriptions/subscriptions.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockPlans, mockUpdatePlan } from '../../mock-plan-data';

describe('Plan AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [PlanModule, SubscriptionsModule,
        TypeOrmModule.forRoot({
          type: 'mysql',
          host: 'db-test',
          port: 3306,
          username: 'test',
          password: 'test',
          database: 'e2e-test',
          entities: ['src/entity/**/*.ts'],
          synchronize: true,
        })],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('Api Plans (GET)', () => {
    const result = request(app.getHttpServer())
      .get('/api/plans/999')
      .expect(HttpStatus.NOT_FOUND)
    return result
  });

  it('Api Plans (POST)', () => {
    const result = request(app.getHttpServer())
      .post('/api/plans').send(mockPlans)
      .expect(HttpStatus.CREATED)
    return result
  });

  it('Api Plans (GET)', () => {
    const result = request(app.getHttpServer())
      .get('/api/plans/1')
      .expect(HttpStatus.OK)
    return result
  });

  it('Api Plans (PUT)', () => {
    const result = request(app.getHttpServer())
      .put('/api/plans/1').send(mockUpdatePlan)
      .expect(HttpStatus.OK)
    return result
  });
});