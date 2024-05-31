import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogInputModelType } from '../../api/models/input/create-blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { statusType } from '../../../../base/oject-result';

export class updateBlogCommand {
  constructor(
    public blogId: string,
    public data: BlogInputModelType,
  ) {}
}

@CommandHandler(updateBlogCommand)
export class UpdateBlogHandler implements ICommandHandler<updateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: updateBlogCommand) {
    const blog = await this.blogRepository.getBlogByBlogId(command.blogId);
    if (!blog) {
      return {
        status: statusType.NotFound,
        statusMessages: 'Blog has not found',
        data: null,
      };
    }
    blog.update(command.data);
    await this.blogRepository.updateBlog(blog);
    return {
      status: statusType.Success,
      statusMessages: 'Blog has been update',
      data: null,
    };
  }
}
