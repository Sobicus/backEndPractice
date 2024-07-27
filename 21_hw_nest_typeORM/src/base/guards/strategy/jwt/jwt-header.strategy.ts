import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as process from 'process';
import { UsersRepository } from '../../../../features/users/infrastructure/users.repository';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-header',
) {
  constructor(private readonly userRepositorySQL: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate({ userId }: { userId: string }) {
    const user = await this.userRepositorySQL.getUserById(Number(userId));
    if (!user) {
      throw new UnauthorizedException();
    }
    return { userId };
  }
}
