/* eslint-disable @typescript-eslint/no-unused-vars,@typescript-eslint/ban-types,@typescript-eslint/no-explicit-any */
// noinspection PointlessBooleanExpressionJS

import { Inject, Injectable } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

import { UserRepository } from '../../../features/users/repositories/user.repository';

export function NameIsExist(property?: string, validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: NameIsExistConstraint,
    });
  };
}

// Обязательна регистрация в ioc
@ValidatorConstraint({ name: 'NameIsExist', async: false })
@Injectable()
export class NameIsExistConstraint implements ValidatorConstraintInterface {
  constructor(@Inject(UserRepository) private readonly userRepository: UserRepository) {}

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(value: any, args: ValidationArguments) {
    const nameIsExist = await this.userRepository.getByLoginOrEmail(value);
    return !!!nameIsExist;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return 'Name already exist';
  }
}
