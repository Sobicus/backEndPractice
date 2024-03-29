export const blogPagination = (
  query: paginationBlogsInputModelType,
): paginationBlogsOutModelType => {
  const defaultValues = {
    searchNameTerm: '',
    sortBy: 'createdAt',
    sortDirection: Description.desc,
    pageNumber: 1,
    pageSize: 10,
    skip: 0,
  };
  if (query.searchNameTerm) {
    defaultValues.searchNameTerm = query.searchNameTerm;
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
export enum sortDirection {
  asc = 'asc',
  desc = 'desc',
}
enum Description {
  asc = 1,
  desc = -1,
}
export type paginationBlogsInputModelType = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: sortDirection;
  pageNumber: number;
  pageSize: number;
};
export type paginationBlogsOutModelType = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: Description;
  pageNumber: number;
  pageSize: number;
  skip: number;
};
