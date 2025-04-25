import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { HealthCheckController } from 'src/modules/health-check/health-check.controller';

describe('HealthCheckController', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should be defined', () => {
    const healthCheckController = app.get<HealthCheckController>(HealthCheckController);
    expect(healthCheckController).toBeDefined();
  });

  it('should return health status', async () => {
    const response = await request(app.getHttpServer()).get('/health-check').expect(200);

    expect(response.body).toEqual({ status: 'ok' });
  });
});
