import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../base/decorators/trim';
import { IsNotBlogExist } from '../../../../../base/guards/blogIsNotExist.guard';
import { IsNotBlogExistInBody } from '../../../../../base/guards/blogIsNotExistInBody.guard';

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
export class PostChangeBody {
  @Trim()
  @Length(1, 30)
  title: string;
  @Trim()
  @Length(1, 100)
  shortDescription: string;
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
