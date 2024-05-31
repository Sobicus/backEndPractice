import { BlogInputModelType } from '../../api/models/input/create-blog.input.model';
import { BlogsRepository } from '../../infrastructure/blogs.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Blogs } from '../../domain/blogs.entity';

export class CreateBlogCommand {
  constructor(public data: BlogInputModelType) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogHandler implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand) {
    const { name, description, websiteUrl } = command.data;
    const blog = Blogs.create({ name, description, websiteUrl });
    const createdBlog = await this.blogRepository.saveBlog(blog);
    return createdBlog._id.toString();
  }
}
