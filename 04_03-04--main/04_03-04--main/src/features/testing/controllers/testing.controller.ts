import { Controller, Delete, HttpCode } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Blog, BlogsDocument } from '../../blogs/repositories/blogs-schema';
import { Comment, CommentsDocument } from '../../comments/repositories/comments/comment.schema';
import { CommentLikes, CommentsLikesDocument } from '../../comments/repositories/likes/comment-like.schema';
import { PostLikes, PostLikesDocument } from '../../posts/repositories/likes/post-likes.schema';
import { Post, PostsDocument } from '../../posts/repositories/post/post.schema';
import { SessionDb, SessionDocument } from '../../security/repository/seesion.schema';
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
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentsDocument>,
    @InjectModel(CommentLikes.name)
    private CommentLikesModel: Model<CommentsLikesDocument>,
    @InjectModel(PostLikes.name)
    private PostLikesModel: Model<PostLikesDocument>,
    @InjectModel(SessionDb.name)
    private SessionDbModel: Model<SessionDocument>,
  ) {}
  @Delete('/all-data')
  @HttpCode(204)
  async clearBd(): Promise<void> {
    await this.BlogModel.deleteMany({});
    await this.PostModel.deleteMany({});
    await this.UserModel.deleteMany({});
    await this.CommentModel.deleteMany({});
    await this.CommentLikesModel.deleteMany({});
    await this.PostLikesModel.deleteMany({});
    await this.SessionDbModel.deleteMany({});
    return;
  }
}
