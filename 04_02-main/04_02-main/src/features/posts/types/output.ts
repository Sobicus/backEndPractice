import { LikeStatus } from './likes/input';
import { newestLike } from './likes/output';

export type ExtendedLikesInfoOutputType = {
  likesCount: number;
  dislikesCount: number;
  newestLikes: newestLike[];
  myStatus: LikeStatus;
};

export type OutputPostType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: ExtendedLikesInfoOutputType;
};
