import { LikesStatusPosts } from '../api/models/input/posts-likesInfo.input.model';

export class PostsLikesInfoSQL {
  postId: number;
  userId: number;
  login: string;
  createdAt: string;
  myStatus: LikesStatusPosts;
}
