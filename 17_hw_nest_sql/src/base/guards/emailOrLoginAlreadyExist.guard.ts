import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { UsersRepositorySQL } from '../../features/users/infrastructure/usersSQL.repository';

@ValidatorConstraint({ async: true })
export class IsUserAlreadyExistConstraint
  implements ValidatorConstraintInterface
{
  constructor(private usersRepositorySQL: UsersRepositorySQL) {}

  async validate(loginOrEmail: string, args: ValidationArguments) {
    const result =
      await this.usersRepositorySQL.findUserByLoginOrEmail(loginOrEmail);
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
