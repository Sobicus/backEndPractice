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
  const updateData = {
    title: 'updatetitle',
    shortDescription: 'updateShortDescription',
    content: 'updateContent',
  };
  let blogId;
  let postId;
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
      blogId = Number(newBlog.body.id);
      const newPost = await request(app)
        .post(`/sa/blogs/${blogId}/posts`)
        .auth('admin', 'qwerty')
        .send(testPost)
        .expect(201);
      postId = Number(newPost.body.id);
      expect(newPost.body).toEqual({
        id: expect.any(String),
        title: testPost.title,
        shortDescription: testPost.shortDescription,
        content: testPost.content,
        blogId: String(blogId),
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
        .post(`/sa/blogs/${blogId}/posts`)
        .send(testPost)
        .expect(401);
    });
    it('Return 400 if title is empty', async () => {
      await request(app)
        .post(`/sa/blogs/${blogId}/posts`)
        .auth('admin', 'qwerty')
        .send({ ...testPost, title: '' })
        .expect(400);
    });
    it('Return 400 if title less than 31 symbols', async () => {
      await request(app)
        .post(`/sa/blogs/${blogId}/posts`)
        .auth('admin', 'qwerty')
        .send({ ...testPost, title: '1234567890123456789012345678901' })
        .expect(400);
    });
    it('Return 400 if shortDescription is empty', async () => {
      await request(app)
        .post(`/sa/blogs/${blogId}/posts`)
        .auth('admin', 'qwerty')
        .send({
          ...testPost,
          shortDescription: ' ',
        })
        .expect(400);
    });
    it('Return 400 if shortDescription less than 101 symbols', async () => {
      await request(app)
        .post(`/sa/blogs/${blogId}/posts`)
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
        .post(`/sa/blogs/${blogId}/posts`)
        .auth('admin', 'qwerty')
        .send({
          ...testPost,
          content: '',
        })
        .expect(400);
    });
    it('Return 400 if content less than 1001 symbols', async () => {
      await request(app)
        .post(`/sa/blogs/${blogId}/posts`)
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
  describe('Get post by blogId', () => {
    it('Returns 200 and post', async () => {
      const post = await request(app)
        .get(`/sa/blogs/${blogId}/posts`)
        .auth('admin', 'qwerty')
        .expect(200);
      expect(post.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          {
            id: expect.any(String),
            title: testPost.title,
            shortDescription: testPost.shortDescription,
            content: testPost.content,
            blogId: String(blogId),
            blogName: testBlog.name,
            createdAt: expect.any(String),
            extendedLikesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
              newestLikes: expect.any(Array),
            },
          },
        ],
      });
    });
    it('Returns 401 if blogId is not found', async () => {
      await request(app)
        .get(`/sa/blogs/1/posts`)
        .auth('admin', 'qwerty')
        .expect(404);
    });
    it('Returns 401 if not authorized', async () => {
      await request(app).get(`/sa/blogs/1/posts`).expect(401);
    });
    it('Returns 401 if send incorrect login or password', async () => {
      await request(app)
        .get(`/sa/blogs/1/posts`)
        .auth('admin', 'qwert')
        .expect(401);
    });
  });
  describe('Put post', () => {
    it('Returns 401 if not authorized', async () => {
      await request(app).put(`/sa/blogs/${blogId}/posts/${postId}`);
    });
    it('Returns 401 if send incorrect login or password', async () => {
      await request(app)
        .put(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwert')
        .expect(401);
    });
    //---------------------------

    it('Return 400 if title is empty', async () => {
      await request(app)
        .put(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty')
        .send({ ...updateData, title: '' })
        .expect(400);
    });
    it('Return 400 if title less than 31 symbols', async () => {
      await request(app)
        .put(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty')
        .send({ ...updateData, title: '1234567890123456789012345678901' })
        .expect(400);
    });
    it('Return 400 if shortDescription is empty', async () => {
      await request(app)
        .put(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty')
        .send({
          ...updateData,
          shortDescription: ' ',
        })
        .expect(400);
    });
    it('Return 400 if shortDescription less than 101 symbols', async () => {
      await request(app)
        .put(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty')
        .send({
          ...updateData,
          shortDescription:
            '12345678901234567890123456789012345678901234567890' +
            '123456789012345678901234567890123456789012345678901',
        })
        .expect(400);
    });
    it('Return 400 if content empty', async () => {
      await request(app)
        .put(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty')
        .send({
          ...updateData,
          content: '',
        })
        .expect(400);
    });
    it('Return 400 if content less than 1001 symbols', async () => {
      await request(app)
        .put(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty')
        .send({
          ...updateData,
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
    it('Returns 204 post has been updated ', async () => {
      await request(app)
        .put(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty')
        .send(updateData)
        .expect(204);
    });
    it('Returns 200 and check updated post', async () => {
      const updatedPost = await request(app)
        .get(`/posts/${postId}`)
        .expect(200);
      console.log(
        'updatedPost.body!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!',
        updatedPost.body,
      );
      expect(updatedPost.body).toEqual({
        id: String(postId),
        title: updateData.title,
        shortDescription: updateData.shortDescription,
        content: updateData.content,
        blogId: String(blogId),
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
  });
  describe('Create 5 posts and check them, use GET throw post and blogs endpoints', () => {
    it('Return 201 and created post', async () => {
      for (let i = 0; i < 5; i++) {
        await request(app)
          .post(`/sa/blogs/${blogId}/posts`)
          .auth('admin', 'qwerty')
          .send({
            ...testPost,
            content: `content${i}`,
            title: `title${i}`,
            shortDescription: `shortDescription${i}`,
          })
          .expect(201);
      }
      const posts = await request(app)
        .get(`/sa/blogs/${blogId}/posts`)
        .auth('admin', 'qwerty')
        .expect(200);
      expect(posts.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 6,
        items: expect.any(Array),
      });
    });
    it('Get all posts', async () => {
      const posts = await request(app).get('/posts').expect(200);
      expect(posts.body).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 6,
        items: expect.any(Array),
      });
    });
    it('Get post by id, returns 200 and post', async () => {
      const post = await request(app).get(`/posts/${postId}`).expect(200);
      expect(post.body).toEqual({
        id: String(postId),
        title: updateData.title,
        shortDescription: updateData.shortDescription,
        content: updateData.content,
        blogId: String(blogId),
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
    it('Get post by id, returns 404 if post doesnt find', async () => {
      await request(app).get(`/posts/1`).expect(404);
    });
  });
  describe('Delete post', () => {
    it('Returns 401 if not authorized', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogId}/posts/${postId}`)
        .expect(401);
    });
    it('Returns 401 if login doesnt correct', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin1', 'qwerty')
        .expect(401);
    });
    it('Returns 401 if password doesnt correct', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty1')
        .expect(401);
    });
    it('Returns 401 if login or auth dont correct', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin1', 'qwerty1')
        .expect(401);
    });
    it('Returns 404 if post doesnt find', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogId}/posts/1`)
        .auth('admin', 'qwerty')
        .expect(404);
    });
    it('Returns 204 post has been deleted', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty')
        .expect(204);
    });
    it('Returns 404 post doesnt find, post has been deleted', async () => {
      await request(app)
        .delete(`/sa/blogs/${blogId}/posts/${postId}`)
        .auth('admin', 'qwerty')
        .expect(404);
    });
  });
});
