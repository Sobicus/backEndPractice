import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/config/appSettings';
import request from 'supertest';
import { EmailService } from '../../src/base/mail/email-server.service';
import { createBlogHelper, createPostHelper } from './test_helpers';

describe('Comments flow', () => {
  let server;
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
  const testComment = {
    content: '12345678901234567890',
  };
  const testUser = {
    login: 'testUser',
    password: '12345678',
    email: 'maksymdeveloper88@gmail.com',
  };
  const testUser1 = {
    login: 'testUser1',
    password: '12345678',
    email: 'maksymdeveloper881@gmail.com',
  };
  let blogId;
  let postId;
  let commentId;
  let userId;
  let accessToken;
  let refreshToken;
  let userId1;
  let accessToken1;
  let refreshToken1;
  let commentId1;

  const commentIdArray:Array<string> = [];
  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    server = moduleRef.createNestApplication();
    appSettings(server);
    await server.init();
    app = server.getHttpServer();
    await request(app).delete('/testing/all-data').expect(204);
    jest
      .spyOn(EmailService.prototype, 'sendUserConfirmationCode')
      .mockImplementation(() => Promise.resolve());
  });
  afterAll(async () => {
    await request(app).delete('/testing/all-data').expect(204);
    await server.close();
  });

  describe('Create user', () => {
    it('Returns 201 and user data', async () => {
      const newUser = await request(app)
        .post('/sa/users')
        .auth('admin', 'qwerty')
        .send(testUser)
        .expect(201);
      userId = newUser.body.id;

      const loginResponse = await request(app)
        .post('/auth/login')
        .send({
          loginOrEmail: testUser.login,
          password: testUser.password,
        })
        .expect(200);

      accessToken = loginResponse.body.accessToken;
      refreshToken = loginResponse.header['set-cookie'];
      //One more user
      const newUser1 = await request(app)
        .post('/sa/users')
        .auth('admin', 'qwerty')
        .send(testUser1)
        .expect(201);
      userId1 = newUser1.body.id;

      const loginResponse1 = await request(app)
        .post('/auth/login')
        .send({
          loginOrEmail: testUser1.login,
          password: testUser1.password,
        })
        .expect(200);

      accessToken1 = loginResponse1.body.accessToken;
      refreshToken1 = loginResponse1.header['set-cookie'];
    });
  });
  describe('Create comment', () => {
    it('Create comments and return 201', async () => {
      // const newBlog = await request(app)
      //   .post('/sa/blogs')
      //   .auth('admin', 'qwerty')
      //   .send(testBlog)
      //   .expect(201);
      // blogId = Number(newBlog.body.id);
      blogId = await createBlogHelper(app, testBlog);
      // const newPost = await request(app)
      //   .post(`/sa/blogs/${blogId}/posts`)
      //   .auth('admin', 'qwerty')
      //   .send(testPost)
      //   .expect(201);
      // postId = Number(newPost.body.id);
      postId = await createPostHelper(app, testPost, blogId);
      const newComment = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testComment)
        .expect(201);
      commentId = Number(newComment.body.id);
      expect(newComment.body).toEqual({
        id: expect.any(String),
        content: testComment.content,
        commentatorInfo: {
          userId: userId,
          userLogin: testUser.login,
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });

      //create comment with another user
      const newComment1 = await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken1}`)
        .send(testComment)
        .expect(201);
      commentId1 = Number(newComment1.body.id);
      expect(newComment1.body).toEqual({
        id: expect.any(String),
        content: testComment.content,
        commentatorInfo: {
          userId: userId1,
          userLogin: testUser1.login,
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });
    });
    it('Create comment and return 401, sent a refresh token instead of an access token', async () => {
      await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${refreshToken}`)
        .send(testComment)
        .expect(401);
    });
    it('Create comment and return 401, did not send access token', async () => {
      await request(app)
        .post(`/posts/${postId}/comments`)
        .send(testComment)
        .expect(401);
    });
    it('Create comment and return 404, post hasn`t found', async () => {
      await request(app)
        .post(`/posts/${1}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testComment)
        .expect(404);
    });
    it('Create comment and return 400 if content less than 20', async () => {
      await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: '1234567890123456789' })
        .expect(400);
    });
    it('Create comment and return 400 if content more than 300', async () => {
      await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content:
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '1234567890123456789012345678901',
        })
        .expect(400);
    });
    it('Create 10 comments and return 201', async () => {
      for (let i = 0; i < 10; i++) {
        const id = await request(app)
          .post(`/posts/${postId}/comments`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...testComment, content: testComment.content + i })
          .expect(201);
        if (id.body.id) {
          commentIdArray.push(id.body.id);
        }
      }
    });
    it('Get all comments and return 200', async () => {
      const allPosts = await request(app)
        .get(`/posts/${postId}/comments`)
        .expect(200);
      expect(allPosts.body).toEqual({
        pagesCount: 2,
        page: 1,
        pageSize: 10,
        totalCount: 12,
        items: expect.any(Array),
      });
      const allPostsWithQuery = await request(app)
        .get(`/posts/${postId}/comments?skip=1`)
        .expect(200);
      expect(allPostsWithQuery.body.items.length).toBe(10);
      allPostsWithQuery.body.items.forEach((comment, index) => {
        if (index < 10) {
          //commentIdArray.push(comment.id);
          expect(comment.content).toBe(testComment.content + (10 - index - 1));
        } else {
          expect(comment.content).toBe(testComment.content);
        }
      });
    });
  });
  describe('Get comment by id', () => {
    it('Get comment by id with wrong id and return 404', async () => {
      console.log('commentId', commentId);

      await request(app)
        .get(`/comments/${commentId + 100}`)
        .expect(404);
    });
    it('Get comment by id return comment', async () => {
      const comment = await request(app)
        .get(`/comments/${commentId}`)
        .expect(200);
      expect(comment.body).toEqual({
        id: String(commentId),
        content: testComment.content,
        commentatorInfo: {
          userId: userId,
          userLogin: testUser.login,
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });
      expect(new Date(comment.body.createdAt)).not.toBeNaN();
    });
  });
  //-----
  describe('Update comment flow', () => {
    it('Update comment and return 404', async () => {
      await request(app)
        .post(`/comments/${commentId + 100}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: 'This is updated comments' })
        .expect(404);
    });
    it('Create comment and return 401, sent a refresh token instead of an access token', async () => {
      await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${refreshToken}`)
        .send(testComment)
        .expect(401);
    });
    it('Create comment and return 401, did not send access token', async () => {
      await request(app)
        .post(`/posts/${postId}/comments`)
        .send(testComment)
        .expect(401);
    });
    it('Create comment and return 404, post hasn`t found', async () => {
      await request(app)
        .post(`/posts/${1}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(testComment)
        .expect(404);
    });
    it('Create comment and return 400 if content less than 20', async () => {
      await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({ content: '1234567890123456789' })
        .expect(400);
    });
    it('Create comment and return 400 if content more than 300', async () => {
      await request(app)
        .post(`/posts/${postId}/comments`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          content:
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '123456789012345678901234567890' +
            '1234567890123456789012345678901',
        })
        .expect(400);
    });
    it('Create 10 comments and return 201', async () => {
      for (let i = 0; i < 10; i++) {
        const response =await request(app)
          .post(`/posts/${postId}/comments`)
          .set('Authorization', `Bearer ${accessToken}`)
          .send({ ...testComment, content: testComment.content + i })
          .expect(201);

      const  body = response.body as unknown as AllPostsDataTypy;
      if(body.id){
        commentIdArray.push(body.id);
      }
    });
    it('Get all comments and return 200', async () => {
      const allPosts = await request(app)
        .get(`/posts/${postId}/comments`)
        .expect(200);
      expect(allPosts.body).toEqual({
        pagesCount: 2,
        page: 1,
        pageSize: 10,
        totalCount: 11,
        items: expect.any(Array),
      });
      const allPostsWithQuery = await request(app)
        .get(`/posts/${postId}/comments?skip=1`)
        .expect(200);
      expect(allPostsWithQuery.body.items.length).toBe(10);
      allPostsWithQuery.body.items.forEach((comment, index) => {
        if (index < 10) {
          //commentIdArray.push(comment.id);
          expect(comment.content).toBe(testComment.content + (10 - index - 1));
        } else {
          expect(comment.content).toBe(testComment.content);
        }
      });
    });
  });
});

type AllDataType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<AllPostsDataTypy>;
};
type AllPostsDataTypy = {
  id: string;
  content: string;
  commentatorInfo: commentatorInfoType;
  createdAt: string;
  likesInfo: likesInfoType;
};
type commentatorInfoType = { userId: string; userLogin: string };
type likesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};
