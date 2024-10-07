import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiSecurity } from '@nestjs/swagger';
import {
  BlogOutputModelType,
  PaginationBlogsType,
} from '../../features/blogs/api/models/output/blog.output.model';
import { ErrorsMessagesType } from '../../config/appSettings';

export function GetAllBlogsEndpoint() {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiOperation({ summary: 'Get all blogs' }),
    ApiResponse({ status: 200, type: PaginationBlogsType }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function CreateBlogEndpoint() {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiOperation({ summary: 'Create new blog' }),
    ApiResponse({
      status: 201,
      description: 'Returns the newly created blog',
      type: BlogOutputModelType,
    }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: ErrorsMessagesType,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
