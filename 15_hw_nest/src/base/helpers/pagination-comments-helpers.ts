export const commentsPagination = (
  query: PaginationCommentsInputModelType,
): PaginationCommentsOutputModelType => {
  const defaultValues = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: Description.desc,
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
    defaultValues.sortDirection = Description.asc;
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

enum Description {
  asc = 1,
  desc = -1,
}
export type PaginationCommentsOutputModelType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: Description;
  skip: number;
};
