import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/settings/aplly-app-setting';
import { AuthTestManager } from '../common/authTestManager';
import { BlogTestManager } from '../common/blogTestManager';
import { CommentTestManager } from '../common/commentTestManager';
import { PostTestManager } from '../common/postTestManager';
import { UserTestManager } from '../common/userTestManager';

describe('Comments e2e', () => {
  let app: INestApplication;
  let httpServer;
  let postTestManager: PostTestManager;
  let blogTetsManager: BlogTestManager;
  let authTestManager: AuthTestManager;
  let commentTestManager: CommentTestManager;
  let userTestManager: UserTestManager;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleFixture.createNestApplication();
    appSettings(app);
    await app.init();
    httpServer = app.getHttpServer();

    postTestManager = new PostTestManager(app);
    blogTetsManager = new BlogTestManager(app);
    authTestManager = new AuthTestManager(app);
    commentTestManager = new CommentTestManager(app);
    userTestManager = new UserTestManager(app);
    await request(httpServer).delete('/testing/all-data').expect(204);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('create comments to post', () => {
    const userData = {
      login: 'loginTest',
      password: 'qwerty',
      email: 'linesreen@mail.ru',
    };
    let token: string;

    const userData2 = {
      login: '2loginTest',
      password: '2qwerty',
      email: '2linesreen@mail.ru',
    };
    let token2: string;

    let blogId: string;
    let postId: string;
    beforeAll(async () => {
      await request(httpServer).delete('/testing/all-data').expect(204);

      await userTestManager.createUser(201, userData);
      await userTestManager.createUser(201, userData2);

      const tokenspair = await authTestManager.getTokens(userData.email, userData.password);
      token = tokenspair.token;
      const tokenspair2 = await authTestManager.getTokens(userData2.email, userData2.password);
      token2 = tokenspair2.token;

      const response = await blogTetsManager.createBlog();
      blogId = response.body.id;

      const postResponse = await postTestManager.createPostToBlog(null, blogId);
      postId = postResponse.body.id;
    });
    it('create comment from user1 and user2', async () => {
      const response1 = await commentTestManager.createCommentToPost(postId, 'userCommentTestTestTest', token);
      const response2 = await commentTestManager.createCommentToPost(postId, 'user2CommentTestTestTest', token2);
      const comment1Id = response1.body.id;
      const comment2Id = response2.body.id;
      const comment1Data = response1.body;
      const comment2Data = response2.body;
      expect.setState({ comment1Data });
      expect.setState({ comment2Data });
      expect.setState({ comment1Id });
      expect.setState({ comment2Id });
    });
    it('get comments by comments id', async () => {
      const { comment1Id } = expect.getState();
      const { comment2Id } = expect.getState();
      const { comment1Data } = expect.getState();
      const { comment2Data } = expect.getState();

      const comment1response = await request(httpServer).get(`/comments/${comment1Id}/`).expect(200);
      expect(comment1response.body).toEqual(comment1Data);

      const comment2response = await request(httpServer).get(`/comments/${comment2Id}/`).expect(200);
      expect(comment2response.body).toEqual(comment2Data);
    });
    it('deletion of a comment by the owner ', async () => {
      const { comment1Id } = expect.getState();
      await request(httpServer).delete(`/comments/${comment1Id}/`).set('Authorization', `Bearer ${token}`).expect(204);
    });
    it('try deleting an already deleted comment ', async () => {
      const { comment1Id } = expect.getState();
      await request(httpServer).delete(`/comments/${comment1Id}/`).set('Authorization', `Bearer ${token}`).expect(404);
    });
    it('attempt to delete someone else"s comment', async () => {
      const { comment2Id } = expect.getState();
      await request(httpServer).delete(`/comments/${comment2Id}/`).set('Authorization', `Bearer ${token}`).expect(403);
    });
    it('get comment by comment id', async () => {
      const { comment1Id } = expect.getState();
      const { comment2Id } = expect.getState();
      const { comment2Data } = expect.getState();

      await request(httpServer).get(`/comments/${comment1Id}/`).expect(404);

      const comment2response = await request(httpServer).get(`/comments/${comment2Id}/`).expect(200);
      expect(comment2response.body).toEqual(comment2Data);
    });
    it('update comment 2', async () => {
      const { comment2Id } = expect.getState();
      await request(httpServer)
        .put(`/comments/${comment2Id}/`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ content: 'UPDATE' })
        .expect(400);

      await request(httpServer)
        .put(`/comments/${comment2Id}/`)
        .set('Authorization', `Bearer ${token}`)
        .send({ content: 'UPDATE' })
        .expect(403);

      await request(httpServer)
        .put(`/comments/123/`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ content: 'UPDATE' })
        .expect(404);

      await request(httpServer)
        .put(`/comments/${comment2Id}/`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ content: 'UPDATEUPDATEUPDATEUPDATEUPDATEUPDATE' })
        .expect(204);
    });
    it('get comment by id with new content', async () => {
      const { comment2Id } = expect.getState();
      const response = await request(httpServer).get(`/comments/${comment2Id}/`).expect(200);
      expect(response.body.content).toEqual('UPDATEUPDATEUPDATEUPDATEUPDATEUPDATE');
    });
  });
});
