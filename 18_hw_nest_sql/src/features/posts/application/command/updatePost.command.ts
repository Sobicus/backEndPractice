import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { PostInputModelType } from '../../api/models/input/create-post.input.model';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostCommand {
  constructor(
    public readonly postId: string,
    public readonly postDTO: PostInputModelType,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private postRepository: PostsRepository) {}

  async execute(command: UpdatePostCommand) {
    const post = await this.postRepository.getPostByPostId(command.postId);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post has been not found',
        data: null,
      };
    }
    post.update(command.postDTO);
    await this.postRepository.updatePost(post);
    return {
      status: statusType.Success,
      statusMessages: 'Post has been update',
      data: null,
    };
  }
}
