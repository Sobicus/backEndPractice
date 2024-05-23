export type QueryPaginationType = {
  searchLoginTerm?: string;
  searchEmailTerm?: string;
  searchNameTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
};
