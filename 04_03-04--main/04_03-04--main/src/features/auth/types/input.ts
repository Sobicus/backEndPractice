import { IsEmail, IsString, Length, Matches } from 'class-validator';

import { Trim } from '../../../infrastructure/decorators/transform/trim';
import { ConfCodeIsValid } from '../../../infrastructure/decorators/validate/conf-code.decorator';
import { EmailIsConformed } from '../../../infrastructure/decorators/validate/email-is-conformed.decorator';
import { NameIsExist } from '../../../infrastructure/decorators/validate/name-is-exist.decorator';

export class UserRegistrationModel {
  @Trim()
  @NameIsExist()
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;
  @Trim()
  @IsString()
  @Length(6, 20)
  password: string;
  @Trim()
  @NameIsExist()
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}

export class ValidationCodeModel {
  @Trim()
  @ConfCodeIsValid()
  code: string;
}

export class EmailResendingModel {
  @Trim()
  @IsEmail()
  @EmailIsConformed()
  email: string;
}
