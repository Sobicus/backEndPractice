import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import * as process from "process";

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(PORT);
}

bootstrap();
