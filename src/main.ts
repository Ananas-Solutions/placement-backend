import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: '*',
      credentials: true,
    },
  });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe());
  // app.use(cookieParser(process.env.COOKIE_SECRET));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Placement API')
    .setDescription('Placement APIs description')
    .setVersion('0.1.0')
    .addTag('placement-api')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('/v1/api', app, document);
  await app.listen(4500);
}
bootstrap();
