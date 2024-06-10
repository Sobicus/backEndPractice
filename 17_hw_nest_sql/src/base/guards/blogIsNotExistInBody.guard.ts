import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { BlogsRepository } from '../../features/blogs/infrastructure/blogs.repository';

@ValidatorConstraint({ async: true })
export class IsNotBlogExistInBodyConstraint
  implements ValidatorConstraintInterface
{
  constructor(private blogsRepository: BlogsRepository) {}

  async validate(blogId: string, args: ValidationArguments) {
    console.log('blogId ', blogId);
    const result = await this.blogsRepository.getBlogByBlogId(blogId);
    console.log('result ', result);
    if (result) {
      return true;
    }
    return false;
  }
}

export function IsNotBlogExistInBody(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotBlogExistInBodyConstraint,
    });
  };
}
