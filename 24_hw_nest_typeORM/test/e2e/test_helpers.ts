import request from 'supertest';

export const createBlogHelper = async (
  app: any,
  testBlog: TestBlogType,
): Promise<number> => {
  const newBlog = await request(app)
    .post('/sa/blogs')
    .auth('admin', 'qwerty')
    .send(testBlog)
    .expect(201);
  return Number(newBlog.body.id);
};

export const createPostHelper = async (
  app: any,
  testPost: TestPostType,
  blogId: number,
): Promise<number> => {
  const newPost = await request(app)
    .post(`/sa/blogs/${blogId}/posts`)
    .auth('admin', 'qwerty')
    .send(testPost)
    .expect(201);
  return Number(newPost.body.id);
};
type TestBlogType = {
  name: string;
  description: string;
  websiteUrl: string;
};
type TestPostType = {
  title: string;
  shortDescription: string;
  content: string;
};
