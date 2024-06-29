import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { statusType } from '../../../../base/oject-result';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { PostsRepositorySQL } from '../../infrastructure/postsSQL.repository';

export class DeletePostCommand {
  constructor(public readonly postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepositorySQL: PostsRepositorySQL) {}

  async execute(command: DeletePostCommand) {
    const post = await this.postsRepositorySQL.getPostByPostId(command.postId);
    if (!post) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Post has been not found',
        data: null,
      };
    }
    await this.postsRepositorySQL.deletePost(command.postId);
    return {
      status: statusType.Success,
      statusMessages: 'Post has been delete',
      data: null,
    };
  }
}
