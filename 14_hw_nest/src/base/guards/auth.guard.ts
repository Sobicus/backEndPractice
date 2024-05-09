import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { Request } from 'express';

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const authorizationHeader = context.switchToHttp().getRequest()
      .headers.authorization;

    console.log(request.headers.authorization);
    console.log(request.headers);
    console.log(authorizationHeader);

    // if (!authorizationHeader) {
    //   throw new UnauthorizedException();
    // }
    const token = authorizationHeader.split(' ')[0];
    if (token !== 'Basic') {
      throw new UnauthorizedException();
    }
    const base64Credentials = authorizationHeader.split(' ')[1]; //'Basic fljglfjldjgfj' -> ['Basic', 'gfrhuhgufh']
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [username, password] = credentials.split(':');

    // Здесь вы можете выполнить проверку логина и пароля, например, сравнение с ожидаемыми значениями
    if (username !== 'admin' && password !== 'qwerty') {
      // Успешная авторизация
      throw new UnauthorizedException();
    }
    return true;
  }
}
