import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModelType } from '../../api/models/input/create-blog.input.model';
import { statusType } from '../../../../base/oject-result';
import { BlogsRepository } from '../../infrastructure/blogs.repository';

export class UpdateBlogCommand {
  constructor(
    public readonly blogId: string,
    public readonly inputModel: BlogInputModelType,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand) {
    const blog = await this.blogRepository.getBlogByBlogId(command.blogId);
    if (!blog) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Blog has not found',
        data: null,
      };
    }
    await this.blogRepository.updateBlog(command);
    return {
      status: statusType.Success,
      statusMessages: 'Blog has been update',
      data: null,
    };
  }
}
