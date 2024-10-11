import { ApiProperty } from '@nestjs/swagger';

export const postsPagination = (
  query: PaginationPostsInputModelType,
): PaginationPostsOutputModelType => {
  const defaultValues = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: 'createdAt',
    sortDirection: sortDirection.desc,
    skip: 0,
  };
  if (
    query.pageNumber &&
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
enum sortDirection {
  asc = 'asc',
  desc = 'desc',
}
export class PaginationPostsInputModelType {
  @ApiProperty({default:1,example:1,description:'Page number',minimum:1,required:false})
  pageNumber: number;
  @ApiProperty({default:10,example:10,description:'Page size',minimum:1,required:false})
  pageSize: number;
  @ApiProperty({default:'createdAt',example:'createdAt',description:'Field to sort by',required:false})
  sortBy: string;
  @ApiProperty({enum:sortDirection,default:'desc',example:'asc',description:'Sort direction',required:false})
  sortDirection: sortDirection;
};



export type PaginationPostsOutputModelType = {
  pageNumber: number;
  pageSize: number;
  sortBy: string;
  sortDirection: sortDirection;
  skip: number;
};
