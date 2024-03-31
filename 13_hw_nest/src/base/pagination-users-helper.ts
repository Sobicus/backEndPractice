export const usersPagination = (
  query: PaginationUsersInputModelType,
): PaginationUsersOutModelType => {
  const defaultValues = {
    searchLoginTerm: '',
    searchEmailTerm: '',
    sortBy: 'createdAt',
    sortDirection: Description.desc,
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
  if (query.sortDirection && query.sortDirection === sortDirection.asc) {
    defaultValues.sortDirection = Description.asc;
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
enum sortDirection {
  asc = 'asc',
  desc = 'desc',
}
enum Description {
  asc = 1,
  desc = -1,
}
export type PaginationUsersInputModelType = {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: string;
  sortDirection: sortDirection;
  pageNumber: number;
  pageSize: number;
};
export type PaginationUsersOutModelType = {
  searchLoginTerm: string;
  searchEmailTerm: string;
  sortBy: string;
  sortDirection: Description;
  pageNumber: number;
  pageSize: number;
  skip: number;
};
