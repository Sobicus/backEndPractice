import { IsString, Length, MAX, MaxLength } from 'class-validator';

export class PostInputModelType {
  @IsString()
  @Length(1, 30)
  title: string;
  @IsString()
  @Length(1, 100)
  shortDescription: string;
  @IsString()
  @MaxLength(1000)
  // @Length(1000)
  content: string;
  @IsString()
  blogId: string;
}
export class PostInputModelBlogControllerType {
  title: string;
  shortDescription: string;
  content: string;
}
