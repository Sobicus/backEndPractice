import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersRepository } from '../../features/users/infrastructure/users.repository';

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private usersRepository: UsersRepository) {}

  async validate(loginOrEmail: string, args: ValidationArguments) {
    console.log('guard', loginOrEmail);
    const result =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);
    console.log('res guard', result);
    if (result) {
      return false;
    }
    return true;
  }
}

export function IsUserAlreadyExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUserAlreadyExistConstraint,
    });
  };
}
