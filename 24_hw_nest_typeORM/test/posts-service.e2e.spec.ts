import { Test, TestingModule } from '@nestjs/testing';
import { request } from 'express';

import { AppModule } from '../src/app.module';
import { appSettings } from '../src/config/appSettings';

describe('integaration test for PostsService', () => {
  // describe('getPosts', () => {
  //   beforeAll(() => {
  //     const moduleRef: TestingModule = await Test.createTestingModule({
  //       imports: [AppModule],
  //     }).compile();
  //     const server = moduleRef.createNestApplication();
  //     appSettings(server);
  //     const app = server.getHttpServer();
  //   });
  //   it('should return', async () => {
  //     expect(5).toBe(5);
  //     await request(app)
  //       .post('/blogs')
  //       .query()
  //       .auth('')
  //       .send({})
  //       .expect(201)
  //       .then((response) => {
  //         expect(response.body).toEqual([]);
  //       });
  //   });
  // });
});
