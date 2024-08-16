export type UserOutputDTO = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};
export type UsersOutputDTO = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserOutputDTO[];
};
export type UserAuthMeDTO = { email: string; login: string; userId: string };

export type UsersEmailConfirmationOutputDTO = {
  id: number;
  email: string;
  login: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  emailConfirmation: EmailConfirmationOutputDTO;
};
type EmailConfirmationOutputDTO = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};
