import { IsString, Length, Matches } from 'class-validator';
import { Trim } from 'src/base/trim';

export class BlogInputModelType {
  @IsString()
  @Trim()
  @Length(1, 15)
  name: string;
  @IsString()
  @Length(1, 500)
  description: string;
  @Matches(
    /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/,
  )
  websiteUrl: string;
}
