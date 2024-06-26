import { Injectable } from '@nestjs/common';
import { UserInputModelType } from '../api/models/input/create-users.input.model';
import bcrypt from 'bcrypt';
import { EmailConfirmationSQL, UsersSQL } from '../domain/usersSQL.entity';
import { UsersRepositorySQL } from '../infrastructure/usersSQL.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepositorySQL: UsersRepositorySQL) {}

  async createUser(inputModel: UserInputModelType): Promise<string> {
    const passwordSalt = await bcrypt.genSalt(10);
    const passwordHash = await this._generateHash(
      inputModel.password,
      passwordSalt,
    );
    const user = new UsersSQL(inputModel, passwordSalt, passwordHash);
    const emailConfirmation = new EmailConfirmationSQL();
    return this.usersRepositorySQL.createUser(user, emailConfirmation);
  }

  async _generateHash(password: string, salt: string) {
    return bcrypt.hashSync(password, salt);
  }
}
