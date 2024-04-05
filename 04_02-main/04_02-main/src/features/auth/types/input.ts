import { IsEmail, IsString, Length, Matches } from 'class-validator';

import { ConfCodeIsValid } from '../../../infrastructure/decorators/validate/conf-code.decorator';
import { EmailIsConformed } from '../../../infrastructure/decorators/validate/email-is-conformed.decorator';
import { NameIsExist } from '../../../infrastructure/decorators/validate/name-is-exist.decorator';

export class UserLoginModel {
  @IsString()
  @Length(1, 30)
  loginOrEmail: string;
  @IsString()
  @Length(1, 30)
  password: string;
}

export class UserRegistrationModel {
  @NameIsExist()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @NameIsExist()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class ValidationCodeModel {
  @ConfCodeIsValid()
  code: string;
}

export class EmailResendingModel {
  @IsEmail()
  @EmailIsConformed()
  email: string;
}
