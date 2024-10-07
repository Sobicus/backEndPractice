import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../base/exception.filter';

export const appSettings = (app: INestApplication) => {
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      transform: true,
      exceptionFactory: (errors) => {
        //const errorsForResponse: { message: string; field: string }[] = [];
        const errorsForResponse: ErrorMessage[] = []; //use our type DTO
        errors.forEach((e) => {
          const constraintsKeys = Object.keys(e.constraints!);
          constraintsKeys.forEach((ckey) => {
            errorsForResponse.push({
              message: e.constraints ? e.constraints[ckey] : '',
              field: e.property,
            });
          });
        });
        // throw new BadRequestException(errorsForResponse);
        throw new BadRequestException({
          errorsMessages: errorsForResponse,
        } as ErrorsMessagesType); // Приведение к типу DTO
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
};

export class ErrorMessage {
  message: string;
  field: string;
}

export class ErrorsMessagesType {
  errorsMessages: ErrorMessage[];
}
