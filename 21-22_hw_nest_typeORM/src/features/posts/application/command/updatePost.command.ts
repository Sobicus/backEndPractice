import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { PostChangeBody } from '../../api/models/input/create-post.input.model';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class UpdatePostCommand {
  constructor(
    public readonly postId: string,
    public readonly postDTO: PostChangeBody,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(private postRepository: PostsRepository) {}

  async execute(command: UpdatePostCommand) {
    console.log('UpdatePostCommand', command.postId);
    const post = await this.postRepository.getPostByPostId(command.postId);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post has been not found',
        data: null,
      };
    }
    console.log('getPostByPostId', post);
    const postUpdateDTO = { postId: command.postId, ...command.postDTO };
    await this.postRepository.updatePost(postUpdateDTO);
    return {
      status: statusType.Success,
      statusMessages: 'Post has been update',
      data: null,
    };
  }
}
