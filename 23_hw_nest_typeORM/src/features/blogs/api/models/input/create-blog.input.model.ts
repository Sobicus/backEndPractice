import { IsString, Length, Matches } from 'class-validator';
import { Trim } from 'src/base/decorators/trim';

export class BlogInputModelType {
  @IsString()
  @Trim()
  @Length(1, 15)
  name: string;
  @IsString()
  @Length(1, 500)
  description: string;
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
