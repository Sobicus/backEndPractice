export type UserOutputDTO = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
export type UsersOtputDTO = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserOutputDTO[];
};
