import { IsString, Length } from 'class-validator';

import { Trim } from '../../../infrastructure/decorators/transform/trim';
import { BlogIsExist } from '../../blogs/decorators/blog-is-exist.decorator';

export class PostCreateModel {
  @Trim()
  @Length(1, 30)
  title: string;
  @Trim()
  @Length(1, 100)
  shortDescription: string;
  @Trim()
  @Length(1, 1000)
  content: string;
  @Trim()
  @BlogIsExist()
  blogId: string;
}

export class PostUpdateType {
  @Trim()
  @Length(1, 30)
  title: string;
  @Trim()
  @Length(1, 30)
  shortDescription: string;
  @Trim()
  @Length(1, 1000)
  content: string;
  @Trim()
  @BlogIsExist()
  blogId: string;
}

export type PostSortData = {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};

export class CommentCreateModel {
  @Trim()
  @IsString()
  @Length(20, 300)
  content: string;
}
