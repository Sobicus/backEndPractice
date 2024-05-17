import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersRepository } from '../../features/users/infrastructure/users.repository';

@ValidatorConstraint({ async: true })
export class IsNotEmailExistConstraint implements ValidatorConstraintInterface {
  constructor(private usersRepository: UsersRepository) {}

  async validate(email: string, args: ValidationArguments) {
    const result = await this.usersRepository.findUserByEmail(email);
    if (!result) {
      return true;
    }
    return false;
  }
}

export function IsNotEmailExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNotEmailExistConstraint,
    });
  };
}
