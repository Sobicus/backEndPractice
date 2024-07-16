import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { NotFoundException } from '@nestjs/common';
import { BlogsRepository } from '../../features/blogs/infrastructure/blogs.repository';

@ValidatorConstraint({ async: true })
export class IsNotBlogExistConstraint implements ValidatorConstraintInterface {
  constructor(private blogsRepositorySQL: BlogsRepository) {}

  async validate(blogId: string, args: ValidationArguments) {
    const result = await this.blogsRepositorySQL.getBlogByBlogId(blogId);
    if (result) {
      return true;
    }
    throw new NotFoundException();
  }
}

export function IsNotBlogExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotBlogExistConstraint,
    });
  };
}
