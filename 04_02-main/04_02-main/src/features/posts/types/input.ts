import { Length } from 'class-validator';

export class PostCreateModel {
  @Length(1, 30)
  title: string;
  @Length(1, 100)
  shortDescription: string;
  @Length(1, 1000)
  content: string;
  blogId: string;
}

export type PostUpdateType = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};

export type PostSortData = {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};
