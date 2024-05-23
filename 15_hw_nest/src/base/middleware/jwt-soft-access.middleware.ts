import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import process from 'node:process';

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
        console.log(payload);
        req.user = payload.userId;
      }
      return next();
    } catch (e) {
      return next();
    }
  }
}
