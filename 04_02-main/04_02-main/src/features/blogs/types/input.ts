import { IsString, Length, Matches } from 'class-validator';

export class BlogCreateModel {
  @Length(1, 15)
  name: string;
  @Length(1, 500)
  description: string;
  @Length(1, 100)
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  websiteUrl: string;
}

export type BlogUpdateType = {
  name: string;
  description: string;
  websiteUrl: string;
};

export class PostToBlogCreateModel {
  @IsString()
  @Length(1, 30)
  title: string;
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @Length(1, 1000)
  content: string;
}

export type BlogSortData = {
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};
