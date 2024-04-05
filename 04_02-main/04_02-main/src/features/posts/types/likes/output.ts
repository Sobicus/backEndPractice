export type ExtendedLikesInfoDbType = {
  likesCount: number;
  dislikesCount: number;
  newestLikes: newestLike[];
};

export type newestLike = {
  addedAt: string;
  userId: string;
  login: string;
};
