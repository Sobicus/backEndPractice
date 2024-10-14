import { IsString, Length } from 'class-validator';

import { Trim } from '../../../../../base/decorators/trim';
import { IsNotBlogExist } from '../../../../../base/guards/blogIsNotExist.guard';
import { IsNotBlogExistInBody } from '../../../../../base/guards/blogIsNotExistInBody.guard';
import { ApiParam, ApiProperty } from '@nestjs/swagger';

export class PostInputModelType {
  @IsString()
  @Trim()
  @Length(1, 30)
  title: string;
  @Trim()
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @Trim()
  @IsString()
  // @MaxLength(1000)
  @Length(1, 1000)
  content: string;
  @IsString()
  @IsNotBlogExistInBody()
  blogId: string;
}
export class PostChangeParam {
  @IsString()
  @IsNotBlogExistInBody()
  blogId: string;
  @IsString()
  postId: string;
}

export type IPost = {
  title: string;
  shortDescription: string;
  content: string;
};
export class PostChangeBody {
  @ApiProperty({
    required: true,
    description: 'post title',
    minLength: 1,
    maxLength: 30,
  })
  @Trim()
  @Length(1, 30)
  title: string;
  @ApiProperty({
    required: true,
    description: 'posr short description',
    minLength: 1,
    maxLength: 100,
  })
  @Trim()
  @Length(1, 100)
  shortDescription: string;
  @ApiProperty({
    required: true,
    description: 'post content',
    minLength: 1,
    maxLength: 1000,
  })
  @Trim()
  @Length(1, 1000)
  content: string;
}
export class BlogExistModel {
  @IsNotBlogExist()
  blogId: string;
}
//TODO check type
export type postCreateDTO = {
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
};
export type PostUpdateDTO = {
  title: string;
  shortDescription: string;
  content: string;
  postId: string;
};
