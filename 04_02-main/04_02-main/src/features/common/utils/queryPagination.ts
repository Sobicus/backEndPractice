import { QueryPaginationType } from '../types/input';

export class QueryPagination {
  static convertQueryPination(queryParams: QueryPaginationType): QueryPaginationResult {
    return {
      searchLoginTerm: queryParams.searchLoginTerm || null,
      searchEmailTerm: queryParams.searchEmailTerm || null,
      searchNameTerm: queryParams.searchNameTerm || null,
      sortBy: queryParams.sortBy || 'createdAt',
      sortDirection: queryParams.sortDirection === 'asc' ? 'asc' : 'desc',
      pageNumber: queryParams.pageNumber || '1',
      pageSize: queryParams.pageSize || '10',
    };
  }
}

interface QueryPaginationResult {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
  searchNameTerm: string | null;
  sortBy: string;
  sortDirection: 'asc' | 'desc';
  pageNumber: string;
  pageSize: string;
}
