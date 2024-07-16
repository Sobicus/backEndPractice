export type UserOutputDTO = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
export type UsersOutputDTO = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserOutputDTO[];
};
export type UserAuthMeDTO = { email: string; login: string; userId: string };
