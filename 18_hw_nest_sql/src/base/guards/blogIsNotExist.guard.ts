import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BlogsRepository } from '../../features/blogs/infrastructure/blogs.repository';
import { NotFoundException } from '@nestjs/common';

@ValidatorConstraint({ async: true })
export class IsNotBlogExistConstraint implements ValidatorConstraintInterface {
  constructor(private blogsRepository: BlogsRepository) {}

  async validate(blogId: string, args: ValidationArguments) {
    const result = await this.blogsRepository.getBlogByBlogId(blogId);
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
