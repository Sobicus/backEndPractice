import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostInputModelType } from '../../api/models/input/create-post.input.model';
import { statusType } from '../../../../base/oject-result';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';

export class CreatePostCommand {
  constructor(public post: PostInputModelType) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private postRepository: PostsRepository,
    private blogRepository: BlogsRepository,
  ) {}

  async execute(command: CreatePostCommand) {
    const blog = await this.blogRepository.getBlogByBlogId(command.post.blogId);
    if (!blog) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Blog has not found',
        data: null,
      };
    }
    const createdAt = new Date().toISOString();
    const postId = await this.postRepository.createPost({
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
