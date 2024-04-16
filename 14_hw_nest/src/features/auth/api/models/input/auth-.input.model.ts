import { IsString } from 'class-validator';

export class LoginInputModelType {
  @IsString()
  loginOrEmail: string;
  @IsString()
  password: string;
}
