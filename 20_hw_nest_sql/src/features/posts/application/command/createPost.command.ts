import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { PostInputModelType } from '../../api/models/input/create-post.input.model';
import { BlogsRepositorySQL } from '../../../blogs/infrastructure/blogsSQL.repository';
import { PostsRepositorySQL } from '../../infrastructure/postsSQL.repository';

export class CreatePostCommand {
  constructor(public readonly post: PostInputModelType) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogRepositorySQL: BlogsRepositorySQL,
    private postRepositorySQL: PostsRepositorySQL,
  ) {}

  async execute(command: CreatePostCommand) {
    const blog = await this.blogRepositorySQL.getBlogByBlogId(
      command.post.blogId,
    );
    if (!blog) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Blog has not found',
        data: null,
      };
    }
    const createdAt = new Date().toISOString();
    const postId = await this.postRepositorySQL.createPost({
      ...command.post,
      blogName: blog.name,
      createdAt,
    });
    return {
      status: statusType.Created,
      statusMessages: 'Post has been created',
      data: postId,
    };
  }
}
