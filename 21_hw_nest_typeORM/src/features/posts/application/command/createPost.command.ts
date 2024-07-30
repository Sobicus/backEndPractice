import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { PostInputModelType } from '../../api/models/input/create-post.input.model';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { Posts } from '../../domain/posts.entity';

export class CreatePostCommand {
  constructor(public readonly post: PostInputModelType) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogRepository: BlogsRepository,
    private postRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostCommand) {
    const blog = await this.blogRepository.getBlogByBlogId(
      Number(command.post.blogId),
    );
    if (!blog) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Blog has not found',
        data: null,
      };
    }
    const post = await Posts.createPost(command.post);
    const post1 = Posts.createPost(
      command.post.title,
      command.post.shortDescription,
      command.post.content,
      Number(command.post.blogId),
    );
    await this.postRepository.createPost(post1);
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
