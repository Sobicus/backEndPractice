import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../../../features/auth/application/auth.service';
import { UsersDocument } from '../../../../features/users/domain/users.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'loginOrEmail',
    });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<UsersDocument> {
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
