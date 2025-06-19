import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import * as request from 'supertest';
import { Logger } from 'winston';
import { AppModule } from '../src/app.module';
import { TestService } from './test.service';
import { TestModule } from './test.module';

describe('User Controller', () => {
  let app: INestApplication;

  let logger: Logger;
  let testService: TestService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule, TestModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    logger = app.get(WINSTON_MODULE_PROVIDER);
    testService = app.get(TestService);
  });

  describe('POST /api/users', () => {
    beforeEach(async () => {
      await testService.deleteAllUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: '',
          password: '',
          name: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if username already exist', async () => {
      await testService.createUser();
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be created new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users')
        .send({
          username: 'test',
          password: 'test',
          name: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.name).toBe('test');
    });
  });
  // login user
  describe('POST /api/users/login', () => {
    beforeEach(async () => {
      await testService.deleteAllUser();
      await testService.createUser();
    });

    it('should be rejected if request is invalid', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: '',
          password: '',
        });

      logger.info(response.body);

      expect(response.status).toBe(400);
      expect(response.body.errors).toBeDefined();
    });

    it('should be rejected if username or password wrong', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test1',
        });

      logger.info(response.body);

      expect(response.status).toBe(401);
      expect(response.body.errors).toBeDefined();
    });

    it('should be logedin', async () => {
      const response = await request(app.getHttpServer())
        .post('/api/users/login')
        .send({
          username: 'test',
          password: 'test',
        });

      logger.info(response.body);

      expect(response.status).toBe(200);
      expect(response.body.data.username).toBe('test');
      expect(response.body.data.token).toBeDefined();
    });
  });
});
