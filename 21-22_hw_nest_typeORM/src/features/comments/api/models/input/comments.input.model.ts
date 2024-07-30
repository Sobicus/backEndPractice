import { IsString, Length } from 'class-validator';

export type CommentOutputModel = {
  id: string;
  content: string;
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};
export type CommentsOutputModel = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentOutputModel[];
};
export type CommentOutputModelSQL = {
  id: number;
  content: string;
  commentatorInfo: {
    userId: number;
    userLogin: string;
  };
  createdAt: string;
  likesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
  };
};
export type CommentsOutputModelSQL = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: CommentOutputModelSQL[];
};

export class InputUpdateCommentModel {
  @IsString()
  @Length(20, 300)
  content: string;
}

export class InputCreateCommentModel {
  content: string;
  userId: string;
  userLogin: string;
  createdAt: string;
  postId: string;
}
