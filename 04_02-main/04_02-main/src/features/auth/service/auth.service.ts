/* eslint-disable no-underscore-dangle */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { MailService } from '../../../mail/mail.service';
import { UserRepository } from '../../users/repositories/userRepository';
import { UsersDocument } from '../../users/repositories/users-schema';
import { UserService } from '../../users/services/user.service';
import { UserLoginModel, UserRegistrationModel } from '../types/input';

@Injectable()
export class AuthService {
  constructor(
    protected userService: UserService,
    protected jwtService: JwtService,
    protected mailService: MailService,
    protected userRepository: UserRepository,
  ) {}

  async userLogin(loginData: UserLoginModel): Promise<{ token: string; refreshToken: string }> {
    const targetUser: UsersDocument | null = await this.userService.checkCredentials(
      loginData.loginOrEmail,
      loginData.password,
    );
    if (!targetUser) {
      throw new HttpException('login or password not valid', HttpStatus.UNAUTHORIZED);
    }
    const token = await this.createrJwt(targetUser._id, 3);
    const refreshToken = await this.createrJwt(targetUser._id, 10);
    return { token, refreshToken };
  }

  async userRegistration(userData: UserRegistrationModel): Promise<void> {
    const newUser: UsersDocument = await this.userService.createUser(userData);
    const confirmationCode = newUser.emailConfirmation.confirmationCode;
    await this.mailService.sendUserConfirmation(userData.email, userData.login, confirmationCode);
  }

  async userConfirmation(confCode: string, confirmationStatus: boolean): Promise<void> {
    const targetUser: UsersDocument | null = await this.userRepository.findByConfCode(confCode);
    if (!targetUser) throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    targetUser.emailConfirmation.isConfirmed = confirmationStatus;
    targetUser.emailConfirmation.confirmationCode = 'null';
    await this.userRepository.saveUser(targetUser);
  }

  async emailResending(email: string): Promise<void> {
    const targetUser = await this.userRepository.getByLoginOrEmail(email);
    if (!targetUser) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    targetUser.updateConfirmationCode();
    await this.userRepository.saveUser(targetUser);
    await this.mailService.sendUserConfirmation(
      targetUser.accountData.email,
      targetUser.accountData.login,
      targetUser.emailConfirmation.confirmationCode,
    );
  }
  /**
   * Create JWT Token
   * @param userId
   * @param expirationTime : hours count
   * @returns token
   */
  async createrJwt(userId: string, expirationTime: number): Promise<string> {
    return this.jwtService.signAsync({ userId: userId }, { expiresIn: `${expirationTime}h` });
  }
}
