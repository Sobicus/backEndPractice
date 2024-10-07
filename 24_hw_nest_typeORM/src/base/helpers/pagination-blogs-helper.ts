import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { applyDecorators } from '@nestjs/common';

export const blogsPagination = (
  query: paginationBlogsInputModelType,
): paginationBlogsOutModelType => {
  const defaultValues = {
    searchNameTerm: '',
    sortBy: 'createdAt',
    sortDirection: sortDirection.desc,
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
    defaultValues.sortDirection = sortDirection.asc;
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

export class paginationBlogsInputModelType {
  @ApiProperty({ example: '', description: 'Search term for blog names', required: false })
  searchNameTerm: string;
  @ApiProperty({ example: 'createdAt', description: 'Field to sort by', required: false, default: 'createdAt' })
  sortBy: string;
  @ApiProperty({
    example: 'desc',
     description: 'Sort direction',
    enum: sortDirection,
    required: false,
    default: 'desc',
  })
  sortDirection: sortDirection;
  @ApiProperty({ example: 1, description: 'Page number', minimum: 1,default: 1,required: false })
  pageNumber: number;
  @ApiProperty({ example: 10, description: 'Number of items per page', minimum: 1,default: 10,required: false })
  pageSize: number;
};
export type paginationBlogsOutModelType = {
  searchNameTerm: string;
  sortBy: string;
  sortDirection: sortDirection;
  pageNumber: number;
  pageSize: number;
  skip: number;
};
