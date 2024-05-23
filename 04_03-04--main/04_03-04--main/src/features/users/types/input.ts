import { IsEmail, Length, Matches } from 'class-validator';

import { Trim } from '../../../infrastructure/decorators/transform/trim';
import { NameIsExist } from '../../../infrastructure/decorators/validate/name-is-exist.decorator';

export class UserCreateModel {
  @Trim()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @NameIsExist()
  login: string;
  @Trim()
  @Length(6, 20)
  password: string;
  @Trim()
  @IsEmail()
  @NameIsExist()
  email: string;
}

export type UserDbType = {
  login: string;
  password: string;
  email: string;
};
