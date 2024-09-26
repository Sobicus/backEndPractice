import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/config/appSettings';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';

describe('Posts flow', () => {
  let server: INestApplication;
  let app;
  const testBlog = {
    name: 'testBlog',
    description: 'testBlog',
    websiteUrl: 'https://testBlog.com',
  };
  const testPost = {
    title: 'testPost',
    shortDescription: 'testPost',
    content: '1234567890',
  };
  let blogsId;
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
    await request(app).delete('/testing/all-data').expect(204);
    await server.close();
  });

  describe('Get all posts', () => {
    it('Returns 200 and empty array', async () => {
      const allPosts = await request(app).get('/posts').expect(200);
      expect(allPosts.body).toEqual({
        pagesCount: 0,
        page: 0,
        pageSize: 0,
        totalCount: 0,
        items: expect.any(Array),
      });
    });
    it('Returns 404', async () => {
      await request(app).get('/posts/1').expect(404);
    });
  });
  describe('Create post', () => {
    it('Returns 201 and created post', async () => {
      const newBlog = await request(app)
        .post('/sa/blogs')
        .auth('admin', 'qwerty')
        .send(testBlog)
        .expect(201);
      blogsId = Number(newBlog.body.id);
      console.log('blogsId', blogsId);
      const newPost = await request(app)
        .post(`/sa/blogs/${blogsId}/posts`)
        .auth('admin', 'qwerty')
        .send(testPost)
        .expect(201);
      console.log('newPost.body', newPost.body);
      expect(newPost.body).toEqual({
        id: expect.any(String),
        title: testPost.title,
        shortDescription: testPost.shortDescription,
        content: testPost.content,
        blogId: String(blogsId),
        blogName: testBlog.name,
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: expect.any(Array),
        },
      });
    });
    it('Returns 401 Unauthorized', async () => {
      await request(app)
        .post(`/sa/blogs/${blogsId}/posts`)
        .send(testPost)
        .expect(401);
    });
    it('Return 400 if title is empty', async () => {
      await request(app)
        .post(`/sa/blogs/${blogsId}/posts`)
        .auth('admin', 'qwerty')
        .send({ ...testPost, title: '' })
        .expect(400);
    });
    it('Return 400 if title less than 31 symbols', async () => {
      await request(app)
        .post(`/sa/blogs/${blogsId}/posts`)
        .auth('admin', 'qwerty')
        .send({ ...testPost, title: '1234567890123456789012345678901' })
        .expect(400);
    });
    it('Return 400if shortDescription is empty', async () => {
      await request(app)
        .post(`/sa/blogs/${blogsId}/posts`)
        .auth('admin', 'qwerty')
        .send({
          ...testPost,
          shortDescription: ' ',
        })
        .expect(400);
    });
    it('Return 400 if shortDescription less than 101 symbols', async () => {
      await request(app)
        .post(`/sa/blogs/${blogsId}/posts`)
        .auth('admin', 'qwerty')
        .send({
          ...testPost,
          shortDescription:
            '12345678901234567890123456789012345678901234567890' +
            '123456789012345678901234567890123456789012345678901',
        })
        .expect(400);
    });
    it('Return 400 if content empty', async () => {
      await request(app)
        .post(`/sa/blogs/${blogsId}/posts`)
        .auth('admin', 'qwerty')
        .send({
          ...testPost,
          content: '',
        })
        .expect(400);
    });
    it('Return 400 if content less than 1001 symbols', async () => {
      await request(app)
        .post(`/sa/blogs/${blogsId}/posts`)
        .auth('admin', 'qwerty')
        .send({
          ...testPost,
          shortDescription:
            '12345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890' +
            '12345678901234567890123456789012345678901234567890' +
            '123456789012345678901234567890123456789012345678901',
        })
        .expect(400);
    });
  });
});
