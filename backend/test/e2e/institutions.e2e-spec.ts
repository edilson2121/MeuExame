import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Institutions (e2e)', () => {
  let app: INestApplication;
  let adminToken: string;
  let userToken: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }));
    await app.init();

    // Get tokens for tests
    const adminLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'admin@meuexame.com', password: 'admin123' });
    adminToken = adminLogin.body.access_token;

    const userLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'estudante@meuexame.com', password: 'admin123' });
    userToken = userLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/institutions (GET)', () => {
    it('should return all institutions', () => {
      return request(app.getHttpServer())
        .get('/api/institutions')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should return institutions with pagination', () => {
      return request(app.getHttpServer())
        .get('/api/institutions?page=1&limit=10')
        .expect(200);
    });
  });

  describe('/api/institutions/:id (GET)', () => {
    it('should return a single institution', () => {
      return request(app.getHttpServer())
        .get('/api/institutions/inst-uem')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('name');
          expect(res.body.id).toBe('inst-uem');
        });
    });

    it('should return 404 for non-existent institution', () => {
      return request(app.getHttpServer())
        .get('/api/institutions/non-existent')
        .expect(404);
    });
  });

  describe('/api/institutions (POST) - Admin only', () => {
    it('should allow admin to create institution', () => {
      return request(app.getHttpServer())
        .post('/api/institutions')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          name: 'Nova Instituição E2E',
          city: 'Maputo',
          country: 'Moçambique',
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('id');
          expect(res.body.name).toBe('Nova Instituição E2E');
        });
    });

    it('should deny regular user from creating institution', () => {
      return request(app.getHttpServer())
        .post('/api/institutions')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          name: 'Test Institution',
          city: 'Maputo',
          country: 'Moçambique',
        })
        .expect(403);
    });

    it('should deny unauthenticated user', () => {
      return request(app.getHttpServer())
        .post('/api/institutions')
        .send({
          name: 'Test Institution',
          city: 'Maputo',
          country: 'Moçambique',
        })
        .expect(401);
    });
  });

  describe('/api/institutions/:id (PATCH) - Admin only', () => {
    it('should allow admin to update institution', () => {
      return request(app.getHttpServer())
        .patch('/api/institutions/inst-uem')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isPaid: true })
        .expect(200);
    });
  });

  describe('/api/institutions/:id (DELETE) - Admin only', () => {
    it('should deny regular user from deleting', () => {
      return request(app.getHttpServer())
        .delete('/api/institutions/inst-uem')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(403);
    });
  });
});
