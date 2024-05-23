// noinspection JSUnresolvedReference
import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ThrottlerGuard } from '@nestjs/throttler';
import { render } from 'prettyjson';
import request from 'supertest';

import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/settings/aplly-app-setting';
import { AuthTestManager } from '../common/authTestManager';
import { BlogTestManager } from '../common/blogTestManager';
import { CommentTestManager } from '../common/commentTestManager';
import { PostTestManager } from '../common/postTestManager';
import { UserTestManager } from '../common/userTestManager';

const userCreateData = {
  login: 'logTest',
  password: 'qwerty',
  email: 'linesreen@mail.ru',
};
const user2CreateData = {
  login: '2logTest',
  password: '2qwerty',
  email: '2linesreen@mail.ru',
};
let token: string;
let token2: string;

let blogId: string;
let postId: string;
let commentsUser1;
let commentsUser2;
describe('Users e2e test', () => {
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
    }) //Мокаем ддос защиту для того что бы она не мешала
      .overrideGuard(ThrottlerGuard)
      .useValue({
        canActivate: () => {
          return true;
        },
      })
      .compile();
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

    await userTestManager.createUser(201, userCreateData);
    await userTestManager.createUser(201, user2CreateData);

    const tokenspair = await authTestManager.getTokens(userCreateData.email, userCreateData.password);
    token = tokenspair.token;
    const tokenspair2 = await authTestManager.getTokens(user2CreateData.email, user2CreateData.password);
    token2 = tokenspair2.token;

    const response = await blogTetsManager.createBlog();
    blogId = response.body.id;

    const postResponse = await postTestManager.createPostToBlog(null, blogId);
    postId = postResponse.body.id;
  });

  afterAll(async () => {
    await app.close();
  });
  describe('comments likes', () => {
    it('create comment from user1 and user2', async () => {
      commentsUser1 = await commentTestManager.createNcommentsToPost(5, postId, token);
      commentsUser2 = await commentTestManager.createNcommentsToPost(5, postId, token, 'user2');
    });
    it('can not like without authorization', async () => {
      await request(httpServer)
        .put(`/comments/${commentsUser1[0].id}/like-status`)
        .set('Authorization', `123`)
        .send({ likeStatus: 'Like' })
        .expect(401);
    });
    it('like  comment user 1', async () => {
      await request(httpServer)
        .put(`/comments/${commentsUser1[0].id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
    });
    it('like and dislike comments user 2', async () => {
      await request(httpServer)
        .put(`/comments/${commentsUser1[0].id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
      await request(httpServer)
        .put(`/comments/${commentsUser2[0].id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
    });
    it('get comment by user 1 comments id', async () => {
      const comment1response = await request(httpServer)
        .get(`/comments/${commentsUser2[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(comment1response.body.likesInfo.likesCount).toEqual(1);
      expect(comment1response.body.likesInfo.dislikesCount).toEqual(0);
      expect(comment1response.body.likesInfo.myStatus).toEqual('None');
    });
    it('change like to dislike  comment user 1', async () => {
      await request(httpServer)
        .put(`/comments/${commentsUser1[0].id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
    });
    it('get comment by user 1 comments id', async () => {
      const comment1response = await request(httpServer)
        .get(`/comments/${commentsUser1[0].id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(comment1response.body.likesInfo.likesCount).toEqual(0);
      expect(comment1response.body.likesInfo.dislikesCount).toEqual(2);
      expect(comment1response.body.likesInfo.myStatus).toEqual('Dislike');
    });
    it('get comments to post by user 1 ', async () => {
      const response = await request(httpServer)
        .get(`/posts/${postId}/comments?sortBy=content&sortDirection=asc`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(response.body.items.length).toEqual(10);
      expect(response.body.items[0].likesInfo.likesCount).toEqual(1);
      expect(response.body.items[0].likesInfo.dislikesCount).toEqual(0);
      expect(response.body.items[0].likesInfo.myStatus).toEqual('None');

      expect(response.body.items[1].likesInfo.likesCount).toEqual(0);
      expect(response.body.items[1].likesInfo.dislikesCount).toEqual(2);
      expect(response.body.items[1].likesInfo.myStatus).toEqual('Dislike');
    });
    it('get comments to post by user 2 ', async () => {
      const response = await request(httpServer)
        .get(`/posts/${postId}/comments?sortBy=content&sortDirection=asc`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);
      expect(response.body.items.length).toEqual(10);
      expect(response.body.items[0].likesInfo.likesCount).toEqual(1);
      expect(response.body.items[0].likesInfo.dislikesCount).toEqual(0);
      expect(response.body.items[0].likesInfo.myStatus).toEqual('Like');

      expect(response.body.items[1].likesInfo.likesCount).toEqual(0);
      expect(response.body.items[1].likesInfo.dislikesCount).toEqual(2);
      expect(response.body.items[1].likesInfo.myStatus).toEqual('Dislike');
    });
    it('change likes status to comment user 2', async () => {
      await request(httpServer)
        .put(`/comments/${commentsUser2[0].id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
      await request(httpServer)
        .put(`/comments/${commentsUser1[0].id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/comments/${commentsUser1[0].id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/comments/${commentsUser1[0].id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
    });
    it('get comments with new like status to post by user 2 ', async () => {
      const response = await request(httpServer)
        .get(`/posts/${postId}/comments?sortBy=content&sortDirection=asc`)
        .set('Authorization', `Bearer ${token2}`)
        .expect(200);
      expect(response.body.items.length).toEqual(10);
      expect(response.body.items[0].likesInfo.likesCount).toEqual(0);
      expect(response.body.items[0].likesInfo.dislikesCount).toEqual(1);
      expect(response.body.items[0].likesInfo.myStatus).toEqual('Dislike');

      expect(response.body.items[1].likesInfo.likesCount).toEqual(1);
      expect(response.body.items[1].likesInfo.dislikesCount).toEqual(1);
      expect(response.body.items[1].likesInfo.myStatus).toEqual('Like');
    });
  });
  describe('likes', () => {
    const user3CreateData = {
      login: '3logTest',
      password: '3qwerty',
      email: '3linesreen@mail.ru',
    };
    const user4CreateData = {
      login: '4logTest',
      password: '4qwerty',
      email: '4linesreen@mail.ru',
    };
    let token3: string;
    let token4: string;

    let post1;
    let post2;
    let post3;
    let post4;

    let blogId;

    beforeAll(async () => {
      //Updates token
      const tokenspair = await authTestManager.getTokens(userCreateData.email, userCreateData.password);
      token = tokenspair.token;
      const tokenspair2 = await authTestManager.getTokens(user2CreateData.email, user2CreateData.password);
      token2 = tokenspair2.token;
      //create two more users
      await userTestManager.createUser(201, user3CreateData);
      await userTestManager.createUser(201, user4CreateData);
      //get jwt tokens for them.
      const tokenspair3 = await authTestManager.getTokens(user3CreateData.email, user3CreateData.password);
      token3 = tokenspair3.token;
      const tokenspair4 = await authTestManager.getTokens(user4CreateData.email, user4CreateData.password);
      token4 = tokenspair4.token;

      const response = await blogTetsManager.createBlog();
      blogId = response.body.id;

      //create four posts to check for likes
      const post1Response = await postTestManager.createPostToBlog(null, blogId);
      post1 = post1Response.body;

      const post2Response = await postTestManager.createPostToBlog(null, blogId);
      post2 = post2Response.body;

      const post3Response = await postTestManager.createPostToBlog(null, blogId);
      post3 = post3Response.body;

      const post4Response = await postTestManager.createPostToBlog(null, blogId);
      post4 = post4Response.body;
    });
    it('try to like post without authorization', async () => {
      await request(httpServer).put(`/posts/${post1.id}/like-status`).send({ likeStatus: 'Like' }).expect(401);
    });
    it('user1 like post1 | post2 | post3 | post4 ', async () => {
      await request(httpServer)
        .put(`/posts/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post2.id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post3.id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
    });
    it('user2 like post1 | post2 | post3 | post4 ', async () => {
      await request(httpServer)
        .put(`/posts/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post2.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post3.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
    });
    it('user3 like post1 | post2 | post3 | post4 ', async () => {
      await request(httpServer)
        .put(`/posts/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${token3}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post2.id}/like-status`)
        .set('Authorization', `Bearer ${token3}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post3.id}/like-status`)
        .set('Authorization', `Bearer ${token3}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${token3}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
    });
    it('user4 Dislike post1 | post2 | post3 | post4 ', async () => {
      await request(httpServer)
        .put(`/posts/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${token4}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post2.id}/like-status`)
        .set('Authorization', `Bearer ${token4}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post3.id}/like-status`)
        .set('Authorization', `Bearer ${token4}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${token4}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
    });
    it('user1 get post1 by id ', async () => {
      const response = await request(httpServer)
        .get(`/posts/${post1.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.extendedLikesInfo.likesCount).toEqual(3);
      expect(response.body.extendedLikesInfo.dislikesCount).toEqual(1);
      expect(response.body.extendedLikesInfo.myStatus).toEqual('Like');

      const lastLikes = response.body.extendedLikesInfo.newestLikes;
      expect(lastLikes[0].login).toEqual(user3CreateData.login);
      expect(lastLikes[1].login).toEqual(user2CreateData.login);
      expect(lastLikes[2].login).toEqual(userCreateData.login);
    });
    it('user1 None post1 by id ', async () => {
      await request(httpServer)
        .put(`/posts/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${token}`)
        .send({ likeStatus: 'None' })
        .expect(204);
    });
    it('user1 get post1 with new like statuse by id ', async () => {
      const response = await request(httpServer)
        .get(`/posts/${post1.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(response.body.extendedLikesInfo.likesCount).toEqual(2);
      expect(response.body.extendedLikesInfo.dislikesCount).toEqual(1);
      expect(response.body.extendedLikesInfo.myStatus).toEqual('None');

      const lastLikes = response.body.extendedLikesInfo.newestLikes;
      expect(lastLikes[0].login).toEqual(user3CreateData.login);
      expect(lastLikes[1].login).toEqual(user2CreateData.login);
      expect(lastLikes.length).toEqual(2);
    });
    it('user 1 get posts to blog1', async () => {
      const response = await request(httpServer)
        .get(`/blogs/${blogId}/posts`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const posts = response.body.items;
      console.log(render(response.body));
      expect(posts[0].extendedLikesInfo.newestLikes[0].login).toEqual(user3CreateData.login);
      expect(posts[0].extendedLikesInfo.newestLikes[1].login).toEqual(user2CreateData.login);
      expect(posts[0].extendedLikesInfo.newestLikes[2].login).toEqual(userCreateData.login);

      expect(posts[3].extendedLikesInfo.newestLikes[0].login).toEqual(user3CreateData.login);
      expect(posts[3].extendedLikesInfo.newestLikes[1].login).toEqual(user2CreateData.login);
      expect(posts[3].extendedLikesInfo.newestLikes.length).toEqual(2);
    });
    it('user2 like post1 | post2 | post3 | post4 again ', async () => {
      //Updates token again
      const tokenspair = await authTestManager.getTokens(userCreateData.email, userCreateData.password);
      token = tokenspair.token;
      const tokenspair2 = await authTestManager.getTokens(user2CreateData.email, user2CreateData.password);
      token2 = tokenspair2.token;

      await request(httpServer)
        .put(`/posts/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post2.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post3.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Like' })
        .expect(204);
    });
    it('user 1 get posts to blog1 checks that everything is still the same.', async () => {
      const response = await request(httpServer)
        .get(`/blogs/${blogId}/posts`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const posts = response.body.items;
      console.log(render(response.body));
      expect(posts[0].extendedLikesInfo.newestLikes[0].login).toEqual(user3CreateData.login);
      expect(posts[0].extendedLikesInfo.newestLikes[1].login).toEqual(user2CreateData.login);
      expect(posts[0].extendedLikesInfo.newestLikes[2].login).toEqual(userCreateData.login);

      expect(posts[3].extendedLikesInfo.newestLikes[0].login).toEqual(user3CreateData.login);
      expect(posts[3].extendedLikesInfo.newestLikes[1].login).toEqual(user2CreateData.login);
      expect(posts[3].extendedLikesInfo.newestLikes.length).toEqual(2);
    });
    it('user2 Dislike post1 | post2 | post3 | post4 again ', async () => {
      await request(httpServer)
        .put(`/posts/${post1.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post2.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post3.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
      await request(httpServer)
        .put(`/posts/${post4.id}/like-status`)
        .set('Authorization', `Bearer ${token2}`)
        .send({ likeStatus: 'Dislike' })
        .expect(204);
    });
    it('user 1 get posts to blog1 checks the data should change..', async () => {
      const response = await request(httpServer)
        .get(`/blogs/${blogId}/posts`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      const posts = response.body.items;
      console.log(render(response.body));
      expect(posts[0].extendedLikesInfo.newestLikes[0].login).toEqual(user3CreateData.login);
      expect(posts[0].extendedLikesInfo.newestLikes[1].login).toEqual(userCreateData.login);
      expect(posts[0].extendedLikesInfo.newestLikes.length).toEqual(2);

      expect(posts[3].extendedLikesInfo.newestLikes[0].login).toEqual(user3CreateData.login);
      expect(posts[3].extendedLikesInfo.newestLikes.length).toEqual(1);
    });
  });
});
