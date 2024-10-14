import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../../../../features/auth/application/auth.service';
import { Users } from '../../../../features/users/domain/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(loginOrEmail: string, password: string): Promise<Users> {
    const result = await this.authService.checkCredentials({
      loginOrEmail,
      password,
    });
    if (!result.data) {
      throw new UnauthorizedException();
    }
    return result.data;
  }
}
