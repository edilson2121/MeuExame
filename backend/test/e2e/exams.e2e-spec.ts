import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';

describe('Exams (e2e)', () => {
  let app: INestApplication;
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

    const userLogin = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email: 'estudante@meuexame.com', password: 'admin123' });
    userToken = userLogin.body.access_token;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/exams (GET)', () => {
    it('should return all published exams', () => {
      return request(app.getHttpServer())
        .get('/api/exams')
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });

    it('should filter by subject', () => {
      return request(app.getHttpServer())
        .get('/api/exams?subjectId=sub-matematica')
        .expect(200);
    });
  });

  describe('/api/exams/:id (GET)', () => {
    it('should return exam details with questions', () => {
      return request(app.getHttpServer())
        .get('/api/exams/exam-matematica-2024')
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('title');
          expect(res.body).toHaveProperty('questions');
        });
    });

    it('should return 404 for non-existent exam', () => {
      return request(app.getHttpServer())
        .get('/api/exams/non-existent')
        .expect(404);
    });
  });

  describe('/api/exams/:id/submit (POST)', () => {
    it('should submit exam and return score', () => {
      return request(app.getHttpServer())
        .post('/api/exams/exam-matematica-2024/submit')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          answers: [
            { questionId: 'q1', answer: '4' },
            { questionId: 'q2', answer: '50' },
          ],
        })
        .expect(201)
        .expect((res) => {
          expect(res.body).toHaveProperty('score');
          expect(res.body).toHaveProperty('total');
        });
    });

    it('should deny unauthenticated submission', () => {
      return request(app.getHttpServer())
        .post('/api/exams/exam-matematica-2024/submit')
        .send({
          answers: [{ questionId: 'q1', answer: '4' }],
        })
        .expect(401);
    });
  });

  describe('/api/exams/:id/results (GET)', () => {
    it('should return user exam results', () => {
      return request(app.getHttpServer())
        .get('/api/exams/exam-matematica-2024/results')
        .set('Authorization', `Bearer ${userToken}`)
        .expect(200)
        .expect((res) => {
          expect(Array.isArray(res.body)).toBe(true);
        });
    });
  });
});
