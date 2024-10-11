import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { appSettings } from './config/appSettings';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const PORT = process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  appSettings(app);
  //swagger
  const config = new DocumentBuilder()
    .setTitle(' RESTful API with Swagger')
    .setDescription('The application API description')
    .setVersion('1.0')
    .addTag('Start tag')
    .addSecurity('basic', { type: 'http', scheme: 'basic' })
    //.addBasicAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  await app.listen(PORT);
}

bootstrap();
