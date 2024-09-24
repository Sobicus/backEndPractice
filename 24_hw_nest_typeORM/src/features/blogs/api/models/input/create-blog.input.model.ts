import { IsString, Length, Matches } from 'class-validator';

import { Trim } from '../../../../../base/decorators/trim';

export interface IBlogInputModel {
  name: string;
  description: string;
  websiteUrl: string;
}
export class BlogInputModelType {
  @IsString()
  @Trim()
  @IsString()
  @Length(1, 15)
  @IsString()
  name: string;
  @IsString()
  @Trim()
  @Length(1, 500)
  description: string;
  @IsString()
  @Trim()
  @Length(1, 100)
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}

export type BlogUpdetedModelType = {
  id: number;
  name: string;
  description: string;
  websiteUrl: string;
};
