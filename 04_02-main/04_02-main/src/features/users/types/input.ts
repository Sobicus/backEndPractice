import { IsEmail, Length, Matches } from 'class-validator';

import { NameIsExist } from '../../../infrastructure/decorators/validate/name-is-exist.decorator';

export class UserCreateModel {
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  @NameIsExist()
  login: string;
  @Length(6, 20)
  password: string;
  @IsEmail()
  //@NameIsExist()
  email: string;
}

export type UserSortData = {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  pageNumber?: string;
  pageSize?: string;
  searchLoginTerm?: string;
  searchEmailTerm?: string;
};

export type UserDbType = {
  login: string;
  password: string;
  email: string;
};
