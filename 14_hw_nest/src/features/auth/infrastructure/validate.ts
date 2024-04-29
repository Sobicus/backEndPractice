import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/infrastructure/users.repository';

export function ConfirmationCodeIsValid(
  property?: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: ConfirmationCodeIsValidConstraint,
    });
  };
}

@ValidatorConstraint({ name: 'ConfirmationCodeIsValid', async: true })
@Injectable()
export class ConfirmationCodeIsValidConstraint
  implements ValidatorConstraintInterface
{
  constructor(private readonly usersRepository: UsersRepository) {}

  async validate(value: any, validationArguments: ValidationArguments) {
    console.log('validate ', value);
    console.log('validationArguments ', validationArguments);
    console.log('this.usersRepository ', this.usersRepository);
    const user = await this.usersRepository.findUserByCode(value);
    console.log('user in validate ', user);
    if (!user) {
      return false;
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      return false;
    }
    if (user.emailConfirmation.isConfirmed) {
      return false;
    }
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Code is not valid';
  }
}
