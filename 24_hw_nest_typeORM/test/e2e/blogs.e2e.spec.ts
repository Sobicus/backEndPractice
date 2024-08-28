import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/config/appSettings';
import request from 'supertest';

describe('Blogs flow', () => {
  //start server
  let server: INestApplication;
  let app;
  const testBlog = {
    name: 'testBlog1',
    description: 'testBlog1',
    websiteUrl: 'https://testBlog1.com',
  };
  beforeAll(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    server = moduleRef.createNestApplication();
    appSettings(server);
    await server.init();
    app = server.getHttpServer();
    await request(app).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    jest.clearAllMocks();
    await request(app).delete('/testing/all-data').expect(204);
    await server.close();
  });
  //registration user flow
  describe('Get all blogs', () => {
    it('Returns 200 and all blogs', async () => {
      await request(app).get('/sa/blogs').auth('admin', 'qwerty').expect(200);
    });
    it('Returns 200 and all blogs', async () => {
      const allBlogs = await request(app)
        .get('/sa/blogs')
        .auth('admin', 'qwerty')
        .expect(200);
      expect(allBlogs.body).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: expect.any(Array),
      });
    });
    it('Returns 200 and all blogs', async () => {
      const allBlogs = await request(app)
        .get('/sa/blogs?pageNumber=2&pageSize=15')
        .auth('admin', 'qwerty')
        .expect(200);
      expect(allBlogs.body).toEqual({
        pagesCount: 0,
        page: 2,
        pageSize: 15,
        totalCount: 0,
        items: expect.any(Array),
      });
    });
  });
  describe('Create blog', () => {
    it('Returns 200 and new blog', async () => {
      const newBlog = await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send(testBlog)
        .expect(201);

      expect(newBlog.body).toEqual({
        id: expect.any(String),
        name: testBlog.name,
        description: testBlog.description,
        websiteUrl: testBlog.websiteUrl,
        createdAt: expect.any(String),
        isMembership: false,
      });
    });
    it('Returns 400 inputModel has incorrect values, name must be more then 0 symbols', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({ ...testBlog, name: ' ' })
        .expect(400);
    });
    it('Returns 400 inputModel has incorrect values, name must be less then 15 symbols', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({ ...testBlog, name: 'qwertyuiopasdfgh' })
        .expect(400);
    });
    it('Returns 400 inputModel has incorrect values, name must be less then 15 symbols', async () => {
      await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send({ ...testBlog, name: 113 })
        .expect(400);
    });
  });
});
