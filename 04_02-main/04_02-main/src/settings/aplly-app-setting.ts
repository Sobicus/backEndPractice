/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

import { AppModule } from '../app.module';
import { HttpExceptionFilter } from '../infrastructure/exception-filters/http-exception-filter';

export const appSettings = (app: INestApplication) => {
  // Для внедрения зависимостей в validator constraint (кастомные пайпы)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  //Для доступа с другого ip
  app.use(cookieParser());
  app.enableCors();
  //Для валидации входных параметров
  app.useGlobalPipes(
    new ValidationPipe({
      // Для работы трансформации входящих данных
      transform: true,
      // Выдавать первую ошибку для каждого поля
      stopAtFirstError: true,
      // Перехватываем ошибку, кастомизируем её и выкидываем 400 с собранными данными
      exceptionFactory: (errors) => {
        const customErrors = [];

        errors.forEach((e) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const constraintKeys = Object.keys(e.constraints);

          constraintKeys.forEach((cKey) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const msg = e.constraints[cKey];

            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            customErrors.push({ field: e.property, message: msg });
          });
        });

        // Error 400
        throw new BadRequestException(customErrors);
      },
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
};
