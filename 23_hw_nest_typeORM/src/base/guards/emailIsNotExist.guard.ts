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
    const user = await this.usersRepository.findUserByEmail(email);
    //todo user!.id а было user?.id
    if (!user) return false;
    const emailConfirmationDTO =
      await this.usersRepository.findEmailConfirmationByUserId(user.id);
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
