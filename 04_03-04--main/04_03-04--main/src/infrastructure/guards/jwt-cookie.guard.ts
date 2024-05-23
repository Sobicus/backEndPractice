import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//FROM Cookie
@Injectable()
export class CookieJwtGuard extends AuthGuard('jwt-cookie') {}
