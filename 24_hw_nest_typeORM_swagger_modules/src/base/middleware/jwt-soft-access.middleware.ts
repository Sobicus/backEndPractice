import process from 'node:process';

import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class JwtSoftAccessMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}
  async use(req: Request, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      return next();
    }
    const token = req.headers.authorization.split(' ')[1];

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      //.catch((e) => next());
      if (payload) {
        req.user = { userId: payload.userId };
      }
      return next();
    } catch (e) {
      return next();
    }
  }
}
