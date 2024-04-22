import { IsString, Length, Matches } from 'class-validator';

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
  login: string;
  @IsString()
  @Length(6, 20)
  password: string;
  @IsString()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)
  email: string;
}
