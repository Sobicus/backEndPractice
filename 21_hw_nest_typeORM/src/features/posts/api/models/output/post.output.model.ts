export type PostOutputModelType = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: {
    likesCount: number;
    dislikesCount: number;
    myStatus: string;
    newestLikes: NewestLikesType[];
  };
};
export type PaginationPostsType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: PostOutputModelType[];
};
export type NewestLikesType = {
  addedAt: string;
  userId: string;
  login: string;
};
