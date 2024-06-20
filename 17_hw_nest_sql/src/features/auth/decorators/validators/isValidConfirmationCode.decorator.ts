import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersRepositorySQL } from 'src/features/users/infrastructure/usersSQL.repository';

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
  constructor(private readonly usersRepositorySQL: UsersRepositorySQL) {}

  async validate(value: any, validationArguments?: ValidationArguments) {
    const emailConfirmationDTO =
      await this.usersRepositorySQL.findEmailConfirmationByCode(value);
    if (!emailConfirmationDTO) {
      return false;
    }
    if (emailConfirmationDTO.expirationDate < new Date()) {
      return false;
    }
    if (emailConfirmationDTO.isConfirmed) {
      return false;
    }
    return true;
  }
  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Code is not valid';
  }
}
