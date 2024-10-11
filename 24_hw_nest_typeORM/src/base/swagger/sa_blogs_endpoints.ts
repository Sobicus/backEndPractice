import { applyDecorators } from '@nestjs/common';
import {
  ApiBasicAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import {
  BlogOutputModelType,
  PaginationBlogsType,
} from '../../features/blogs/api/models/output/blog.output.model';
import { ErrorsMessagesSwaggerType } from '../../config/appSettings';
import { BlogInputModelType } from '../../features/blogs/api/models/input/create-blog.input.model';
import { PostChangeBody } from '../../features/posts/api/models/input/create-post.input.model';
import {
  PaginationPostsType,
  PostOutputModelType,
} from '../../features/posts/api/models/output/post.output.model';

export function GetAllBlogsEndpoint() {
  return applyDecorators(
    // ApiSecurity('basic'),
    ApiBasicAuth(),
    ApiOperation({ summary: 'Get all blogs' }),
    ApiResponse({ status: 200, type: PaginationBlogsType }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function CreateBlogEndpoint() {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiOperation({
      summary: 'Create new blog',
    }),
    ApiBody({
      description: 'Data for constructing new Blog entity',
      type: () => BlogInputModelType,
    }),
    ApiResponse({
      status: 201,
      description: 'Returns the newly created blog',
      type: BlogOutputModelType,
    }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: ErrorsMessagesSwaggerType,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
export function UpdateBlogEndpoint() {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiResponse({ status: 204, description: 'No Content' }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: ErrorsMessagesSwaggerType,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
export function DeleteBlogEndpoint() {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiResponse({ status: 204, description: 'No Content' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'Not found' }),
  );
}
export function CreatePostByBlogIdEndpoint() {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiBody({
      description: 'Data for constructing new post entity',
      type: () => PostChangeBody,
    }),
    ApiResponse({
      status: 201,
      description: 'Returns the newly created post',
      type: () => PostOutputModelType,
    }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: ErrorsMessagesSwaggerType,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 404,
      description: "If specific blog doesn't exists",
    }),
  );
}
export function GetPosByBlogIdEndpoint() {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiResponse({ status: 200, type: () => PaginationPostsType }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 404,
      description: "If specific blog doesn't exists",
    }),
  );
}
export function PutUpdatePostThrowBlogIdEndpoint() {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiBody({ description: 'Data for updating', type: () => PostChangeBody }),
    ApiResponse({ status: 204, description: 'No Content' }),
    ApiResponse({
      status: 400,
      description: 'If the inputModel has incorrect values',
      type: ErrorsMessagesSwaggerType,
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 404,
      description: 'Not Found',
    }),
  );
}
export function DeletePostByBlogIdEndpoint() {
  return applyDecorators(
    ApiSecurity('basic'),
    ApiResponse({ status: 204, description: 'No Content' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({
      status: 404,
      description: 'Not Found',
    }),
  );
}
