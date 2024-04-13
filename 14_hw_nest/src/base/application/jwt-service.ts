import jwt from 'jsonwebtoken';
import { UsersDocument } from 'src/features/users/domain/users.entity';
import * as process from 'node:process';

export const jwtService = {
  async createAccessJWT(user: UsersDocument) {
    const token = await jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '10m',
    });
    return token;
  },
};
