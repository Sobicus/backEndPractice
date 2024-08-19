import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { appSettings } from './config/appSettings';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSettings(app);
  await app.listen(PORT);
}

bootstrap();
