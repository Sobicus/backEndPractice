import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Blog, BlogsDocument } from '../../blogs/repositories/blogs-schema';
import { Post, PostsDocument } from '../../posts/repositories/post-schema';
import { User, UsersDocument } from '../../users/repositories/users-schema';

@Controller('testing')
export class TestingController {
  constructor(
    @InjectModel(Blog.name)
    private BlogModel: Model<BlogsDocument>,
    @InjectModel(Post.name)
    private PostModel: Model<PostsDocument>,
    @InjectModel(User.name)
    private UserModel: Model<UsersDocument>,
  ) {}
  @Delete('/all-data')
  @HttpCode(204)
  async clearBd(): Promise<void> {
    await this.BlogModel.deleteMany({});
    await this.PostModel.deleteMany({});
    await this.UserModel.deleteMany({});
    return;
  }
}
