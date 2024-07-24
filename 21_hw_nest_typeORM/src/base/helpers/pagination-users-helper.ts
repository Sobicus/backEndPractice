export const usersPagination = (
  query: PaginationUsersInputModelType,
): PaginationUsersOutModelType => {
  const defaultValues = {
    searchLoginTerm: '',
    searchEmailTerm: '',
    sortBy: 'createdAt',
    sortDirection: SortDirection.desc,
    pageNumber: 1,
    pageSize: 10,
    skip: 0,
  };
  if (query.searchLoginTerm) {
    defaultValues.searchLoginTerm = query.searchLoginTerm;
  }
  if (query.searchEmailTerm) {
    defaultValues.searchEmailTerm = query.searchEmailTerm;
  }
  if (query.sortBy) {
    defaultValues.sortBy = query.sortBy;
  }
  if (query.sortDirection && query.sortDirection === SortDirection.asc) {
    defaultValues.sortDirection = SortDirection.asc;
  }
  if (
    query.pageNumber &&
    !isNaN(parseInt(query.pageNumber.toString(), 10)) &&
    parseInt(query.pageNumber.toString(), 10) > 0
  ) {
    defaultValues.pageNumber = +query.pageNumber;
  }
  if (
    query.pageSize &&
    !isNaN(parseInt(query.pageSize.toString(), 10)) &&
    parseInt(query.pageSize.toString(), 10) > 0
  ) {
    defaultValues.pageSize = parseInt(query.pageSize.toString(), 10);
  }
  defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize;

  return defaultValues;
};
enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}
export type PaginationUsersInputModelType = {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};
export type PaginationUsersOutModelType = {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
  skip: number;
};
