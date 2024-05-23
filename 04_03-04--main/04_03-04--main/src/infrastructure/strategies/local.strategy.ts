import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { UserService } from '../../features/users/services/user.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async validate(loginOrEmail: string, password: string) {
    const user = await this.userService.checkCredentials(loginOrEmail, password);
    if (!user) throw new HttpException('login or password not valid', HttpStatus.UNAUTHORIZED);
    return user;
  }
}
