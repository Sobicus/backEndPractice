import { IsString, Length, Matches } from 'class-validator';

import { IsNotEmailExist } from '../../../../../base/guards/emailIsNotExist.guard';
import { IsUserAlreadyExist } from '../../../../../base/guards/emailOrLoginAlreadyExist.guard';
import { ConfirmationCodeIsValid } from '../../../decorators/validators/isValidConfirmationCode.decorator';

export class LoginInputModelType {
  @IsString()
  loginOrEmail: string;
  @IsString()
  password: string;
}
export class RegistrationUserModelType {
  @IsString()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @IsUserAlreadyExist()
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsUserAlreadyExist()
  email: string;
}
export class InputCodeModel {
  @IsString()
  @ConfirmationCodeIsValid()
  code: string;
}
export class InputEmailModel {
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  @IsNotEmailExist()
  email: string;
}
export class InputNewPasswordModel {
  @IsString()
  @Length(6, 20)
  newPassword: string;
  @IsString()
  recoveryCode: string;
}
