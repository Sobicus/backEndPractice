import { BlogInputModelType } from '../api/models/input/create-blog.input.model';

export class BlogsSQL {
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;

  static create({ name, websiteUrl, description }: BlogInputModelType) {
    const blog = new this();
    blog.name = name;
    blog.websiteUrl = websiteUrl;
    blog.description = description;
    blog.createdAt = new Date().toISOString();
    blog.isMembership = false;
    return blog;
  }
}
