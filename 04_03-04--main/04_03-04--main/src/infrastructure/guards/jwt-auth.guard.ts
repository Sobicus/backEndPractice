import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//FROM HEADER
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
