export const commentsPagination = (
  query: PaginationCommentsInputModelType,
): PaginationCommentsOutputModelType => {
  const defaultValues = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: sortDirection.desc,
    skip: 0,
  };
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
    defaultValues.pageSize = +query.pageSize;
  }
  if (query.sortBy) {
    defaultValues.sortBy = query.sortBy;
  }
  if (query.sortDirection && query.sortDirection === sortDirection.asc) {
    defaultValues.sortDirection = sortDirection.asc;
  }
  defaultValues.skip = (defaultValues.pageNumber - 1) * defaultValues.pageSize;
  return defaultValues;
};

export type PaginationCommentsInputModelType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: sortDirection;
};

enum sortDirection {
  asc = 'asc',
  desc = 'desc',
}
export type PaginationCommentsOutputModelType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: sortDirection;
  skip: number;
};
