import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../../features/auth/application/auth.service';
import { UsersSQL } from '../../../../features/users/domain/usersSQL.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(loginOrEmail: string, password: string): Promise<UsersSQL> {
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
