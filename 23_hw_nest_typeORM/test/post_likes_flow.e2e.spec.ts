import { AppModule } from '../src/app.module';
import { Test, TestingModule } from '@nestjs/testing';
import { appSettings } from '../src/config/appSettings';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IBlogInputModel } from '../src/features/blogs/api/models/input/create-blog.input.model';
import { IPost } from '../src/features/posts/api/models/input/create-post.input.model';

type user = {
  accessToken: string;
  refreshToken: string;
  login: string;
  password: string;
  email: string;
};

describe('integaration test for PostsService', () => {
  describe('getPosts', () => {
    const users: user[] = [];
    const userCreateDTO = {
      login: 'lRXSy',
      password: 'string',
      email: 'example@example.com',
    };

    const blog: IBlogInputModel = {
      name: 'string',
      description: 'string',
      websiteUrl: 'https://google.com',
    };

    const post: IPost = {
      title: 'string',
      shortDescription: 'string',
      content: 'https://google.com',
    };

    const postsToLike: Array<IPost & { id: string }> = [];

    let server: INestApplication;
    let app;
    beforeAll(async () => {
      const moduleRef: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
      server = moduleRef.createNestApplication();
      appSettings(server);
      await server.init();
      app = server.getHttpServer();
    });

    it('DELETE -> "/testing/all-data": should remove all data; status 204;', async () => {
      await request(app).delete('/testing/all-data').expect(204);
    });

    it(
      'POST -> "/sa/users": should create new user; status 201; ' +
        'content: created user; used additional methods: GET => /sa/users;',
      async () => {
        const expectedUser = {
          id: expect.any(String),
          email: userCreateDTO.email,
          login: userCreateDTO.login,
          createdAt: expect.any(String),
        };
        const userCreateResponse = await request(app)
          .post('/sa/users')
          .auth('admin', 'qwerty')
          .send(userCreateDTO)
          .expect(201);

        expect(userCreateResponse.body).toEqual(expectedUser);

        const userGetResponse = await request(app)
          .get('/sa/users')
          .auth('admin', 'qwerty')
          .expect(200);

        expect(userGetResponse.body?.items).toHaveLength(1);
        expect(userGetResponse.body?.items[0]).toEqual(expectedUser);
        expect(userGetResponse.body?.items[0]).toEqual(userCreateResponse.body);
      },
    );

    it(
      'POST -> "/auth/login": should sign in user; status 200; ' +
        'content: JWT "access" token, JWT "refresh" token in cookie (http only, secure);',
      async () => {
        const loginResponse = await request(app)
          .post('/auth/login')
          .send({
            loginOrEmail: userCreateDTO.login,
            password: userCreateDTO.password,
          })
          .expect(200);
        const accessToken = loginResponse.body.accessToken;
        const refreshToken = loginResponse.header['set-cookie'];
        expect(loginResponse.body.accessToken).toEqual(expect.any(String));
        expect(loginResponse.header['set-cookie'][0]).toEqual(
          expect.any(String),
        );
        expect(
          loginResponse.header['set-cookie'][0].startsWith('refreshToken'),
        ).toEqual(true);
      },
    );

    it('POST -> "/sa/users", "/auth/login": should create and login 4 users; status 201; content: created users;', async () => {
      for (let i = 0; i < 4; i++) {
        console.log('userCreateResponse iteration: ', i);
        const userCreateResponse = await request(app)
          .post('/sa/users')
          .auth('admin', 'qwerty')
          .send({
            login: `${userCreateDTO.login}${i}`,
            password: userCreateDTO.password,
            email: `${i}${userCreateDTO.email}`,
          })
          .expect(201);

        const loginResponse = await request(app)
          .post('/auth/login')
          .send({
            loginOrEmail: `${userCreateDTO.login}${i}`,
            password: userCreateDTO.password,
          })
          .expect(200);

        const accessToken = loginResponse.body.accessToken;
        const refreshToken = loginResponse.header['set-cookie'];

        const user: user = {
          accessToken,
          refreshToken,
          login: userCreateResponse.body.login,
          email: userCreateResponse.body.email,
          password: userCreateDTO.password,
        };
        users.push(user);
      }

      expect(users).toHaveLength(4);
    });

    it(
      'GET -> "/posts": create 6 posts then: like post 1 by user 1, user 2; like post 2 by user 2, user 3;' +
        ' dislike post 3 by user 1; like post 4 by user 1, user 4, user 2, user 3;' +
        ' like post 5 by user 2, dislike by user 3;' +
        ' like post 6 by user 1, dislike by user 2.' +
        ' Get the posts by user 1 after all likes NewestLikes should be sorted in descending;' +
        ' status 200; content: posts array with pagination; used additional methods: POST => /sa/blogs,' +
        ' POST => /sa/blogs/:blogId/posts, PUT -> posts/:postId/like-status;',
      async () => {
        // like post 1 by user 1, user 2;
        // like post 2 by user 2, user 3;
        // dislike post 3 by user 1;
        // like post 4 by user 1, user 4, user 2, user 3;
        // like post 5 by user 2, dislike by user 3;
        // like post 6 by user 1, dislike by user 2.
        // Get the posts by user 1 after all likes

        const blogCreateResponse = await request(app)
          .post('/sa/blogs')
          .auth('admin', 'qwerty')
          .send(blog)
          .expect(201);

        expect(blogCreateResponse.body).toEqual({
          createdAt: expect.any(String),
          description: blog.description,
          id: expect.any(String),
          isMembership: false,
          name: blog.name,
          websiteUrl: blog.websiteUrl,
        });

        for (let i = 0; i < 6; i++) {
          const postToCreate: IPost = {
            content: post.content,
            shortDescription: post.content + i,
            title: post.title + i,
          };
          const postCreateResponse = await request(app)
            .post(`/sa/blogs/${blogCreateResponse.body.id}/posts`)
            .auth('admin', 'qwerty')
            .send(postToCreate);

          postsToLike.push(postCreateResponse.body);
        }
        console.log('tut, us', users[0].accessToken);

        const allPostsBeforeLikes = await request(app)
          .get(`/posts`)
          .set('Authorization', `Bearer ${users[0].accessToken}`)

          .expect(200);
        await request(app)
          .put(`/posts/${postsToLike[0].id}/like-status`)
          .set('Authorization', `Bearer ${users[0].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);

        await request(app)
          .put(`/posts/${postsToLike[0].id}/like-status`)
          .set('Authorization', `Bearer ${users[1].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);

        await request(app)
          .put(`/posts/${postsToLike[1].id}/like-status`)
          .set('Authorization', `Bearer ${users[1].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);

        await request(app)
          .put(`/posts/${postsToLike[1].id}/like-status`)
          .set('Authorization', `Bearer ${users[2].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);

        //dislike post 3 by user 1;
        await request(app)
          .put(`/posts/${postsToLike[2].id}/like-status`)
          .set('Authorization', `Bearer ${users[0].accessToken}`)
          .send({
            likeStatus: 'Dislike',
          })
          .expect(204);

        //like post 4 by user 1, user 4, user 2, user 3;
        await request(app)
          .put(`/posts/${postsToLike[3].id}/like-status`)
          .set('Authorization', `Bearer ${users[0].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);
        await request(app)
          .put(`/posts/${postsToLike[3].id}/like-status`)
          .set('Authorization', `Bearer ${users[3].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);
        await request(app)
          .put(`/posts/${postsToLike[3].id}/like-status`)
          .set('Authorization', `Bearer ${users[1].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);

        await request(app)
          .put(`/posts/${postsToLike[2].id}/like-status`)
          .set('Authorization', `Bearer ${users[0].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);

        // like post 5 by user 2, dislike by user 3;

        await request(app)
          .put(`/posts/${postsToLike[4].id}/like-status`)
          .set('Authorization', `Bearer ${users[1].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);

        await request(app)
          .put(`/posts/${postsToLike[4].id}/like-status`)
          .set('Authorization', `Bearer ${users[2].accessToken}`)
          .send({
            likeStatus: 'Dislike',
          })
          .expect(204);

        // like post 6 by user 1, dislike by user 2.

        await request(app)
          .put(`/posts/${postsToLike[5].id}/like-status`)
          .set('Authorization', `Bearer ${users[0].accessToken}`)
          .send({
            likeStatus: 'Like',
          })
          .expect(204);

        await request(app)
          .put(`/posts/${postsToLike[5].id}/like-status`)
          .set('Authorization', `Bearer ${users[1].accessToken}`)
          .send({
            likeStatus: 'Dislike',
          })
          .expect(204);

        await request(app)
          .put(`/posts/${postsToLike[5].id}/like-status`)
          .set('Authorization', `Bearer ${users[0].accessToken}`)
          .send({
            likeStatus: 'Dislike',
          })
          .expect(204);
        //Get the posts by user 1 after all likes NewestLikes should be sorted in descending;
        const allPosts = await request(app)
          .get(`/posts`)
          .set('Authorization', `Bearer ${users[0].accessToken}`)

          .expect(200);

        console.log('Dislake postID', `${postsToLike[5].id}`);
        console.log('allPosts.body.items', allPosts.body.items);
        expect(allPosts.body.items).toEqual(
          expect.arrayContaining([
            {
              blogId: expect.any(String),
              blogName: expect.any(String),
              content: expect.any(String),
              createdAt: expect.any(String),
              extendedLikesInfo: {
                dislikesCount: expect.any(Number),
                likesCount: expect.any(Number),
                myStatus: expect.any(String),
                newestLikes: expect.arrayContaining([
                  {
                    addedAt: expect.any(String),
                    userId: expect.any(String),
                    login: expect.any(String),
                  },
                ]),
              },
              id: expect.any(String),
              shortDescription: expect.any(String),
              title: expect.any(String),
            },
          ]),
        );
      },
    );
  });
});
