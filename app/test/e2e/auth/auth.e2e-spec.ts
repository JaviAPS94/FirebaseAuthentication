import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mockUsers } from '../../mock-user-data';
import { AuthModule } from '../../../src/auth/auth.module';
import { UsersModule } from '../../../src/users/users.module';

describe('Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, UsersModule,
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

  it('Api Login (POST)', () => {
    const result = request(app.getHttpServer())
      .post('/api/auth/login').send(mockUsers.usersLogin[0])
      .expect(HttpStatus.UNAUTHORIZED)
    return result;
  });

  it('Api Token (GET)', () => {
    const result = request(app.getHttpServer())
      .get('/api/auth/token')
      .set('Authorization', 'bearer ' + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwibmFtZSI6ImlubWVkaWNhbCIsImFkZGl0aW9uYWxJbmZvIjp7ImFjY291bnQiOjEwLCJjb3VudHJ5IjoxLCJ1c2VFeHRlcm5hbElkcyI6dHJ1ZX0sImNyZWF0ZWRBdCI6IjIwMjAtMDgtMDRUMTM6NTU6NDQuNDIzWiIsInVwZGF0ZWRBdCI6IjIwMjAtMDgtMDRUMTM6NTU6NDQuNDIzWiIsImRlbGV0ZWRBdCI6bnVsbCwiaWF0IjoxNjAwNzA5NTMyLCJleHAiOjE2MDA3OTU5MzJ9.BqCzkt7iIOpdEWGmkjqjTDYHJF7uB_Kcr_jLAKs7a7E")
      .expect(HttpStatus.UNAUTHORIZED)
    return result;
  });

  it('Api User (POST)', () => {
    const result = request(app.getHttpServer())
      .post('/api/auth/user').send(mockUsers.usersCreate[0])
      .expect(HttpStatus.CREATED)
    return result;
  });
});