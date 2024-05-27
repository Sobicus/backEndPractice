import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    if (status === 400) {
      const errorsResponse: {
        errorsMessages: { message: string; field: string }[];
      } = {
        errorsMessages: [],
      };
      const responseBody: any = exception.getResponse();
      if (Array.isArray(responseBody.message)) {
        responseBody.message.forEach((m) =>
          errorsResponse.errorsMessages.push(m),
        );
      } else {
        errorsResponse.errorsMessages.push(responseBody.message);
      }
      response.status(status).json(errorsResponse);
    } else {
      response.status(status).json({
        statusCode: status,
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
