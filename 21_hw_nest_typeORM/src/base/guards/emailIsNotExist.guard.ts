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
  constructor(private usersRepositorySQL: UsersRepository) {}

  async validate(email: string, args: ValidationArguments) {
    const user = await this.usersRepositorySQL.findUserByEmail(email);

    const emailConfirmationDTO =
      await this.usersRepositorySQL.findEmailConfirmationByUserId(user?.id);
    if (emailConfirmationDTO && !emailConfirmationDTO?.isConfirmed) {
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
