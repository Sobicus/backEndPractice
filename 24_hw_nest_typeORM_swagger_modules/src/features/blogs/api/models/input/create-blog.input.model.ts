import { IsString, Length, Matches } from 'class-validator';

import { Trim } from '../../../../../base/decorators/trim';
import { ApiProperty } from '@nestjs/swagger';

export interface IBlogInputModel {
  name: string;
  description: string;
  websiteUrl: string;
}
export class BlogInputModelType {
  @ApiProperty({
    required: true,
    description: 'Blog name',
    minLength: 1,
    maxLength: 15,
  })
  @IsString()
  @Trim()
  @IsString()
  @Length(1, 15)
  @IsString()
  name: string;
  @ApiProperty({
    required: true,
    description: 'Blog description',
    minLength: 1,
    maxLength: 500,
  })
  @IsString()
  @Trim()
  @Length(1, 500)
  description: string;
  @ApiProperty({
    required: true,
    maxLength: 100,
    pattern: `^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$`,
  })
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
