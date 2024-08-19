import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ObjectClassResult, statusType } from '../../../../base/oject-result';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs.repository';
import { PostInputModelType } from '../../api/models/input/create-post.input.model';
import { Posts } from '../../domain/posts.entity';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class CreatePostCommand {
  constructor(public readonly post: PostInputModelType) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogRepository: BlogsRepository,
    private postRepository: PostsRepository,
  ) {}

  async execute(
    command: CreatePostCommand,
  ): Promise<ObjectClassResult<number | null>> {
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
    // const post = await Posts.createPost(command.post);
    const post = Posts.createPost(
      command.post.title,
      command.post.shortDescription,
      command.post.content,
      Number(command.post.blogId),
    );
    const postId = await this.postRepository.createPost(post);
    // const createdAt = new Date().toISOString();
    // const postId = await this.postRepository.createPost({
    //   ...command.post,
    //   blogName: blog.name,
    //   createdAt,
    // });
    return {
      status: statusType.Created,
      statusMessages: 'Post has been created',
      data: postId,
    };
  }
}
