/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { appSettings } from './settings/aplly-app-setting';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Выносим неастройки для удобства тестов
  appSettings(app);
  await app.listen(5001);
}
bootstrap();
