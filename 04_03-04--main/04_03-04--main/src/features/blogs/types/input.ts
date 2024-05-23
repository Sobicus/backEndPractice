import { IsString, Length, Matches } from 'class-validator';

import { Trim } from '../../../infrastructure/decorators/transform/trim';

export class BlogCreateModel {
  @Trim()
  @Length(1, 15)
  name: string;
  @Trim()
  @Length(1, 500)
  description: string;
  @Trim()
  @Length(1, 100)
  @Matches(/^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/)
  websiteUrl: string;
}

export class PostToBlogCreateModel {
  @Trim()
  @IsString()
  @Length(1, 30)
  //@ApiProperty()
  title: string;

  @Trim()
  @IsString()
  @Length(1, 100)
  @Trim()
  shortDescription: string;

  @IsString()
  @Trim()
  @Length(1, 1000)
  content: string;
}
