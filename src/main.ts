import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  /**
   * Swagger settings
   */
  const config = new DocumentBuilder()
    .setTitle('Novel Sitemap')
    .setDescription('Novel Sitemap description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  /**
   * CORS settings
   */
  app.enableCors({ origin: process.env.APP_CORS_ORIGIN });

  /**
   * DTO settings
   */
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  /**
   * Serve static files from the 'public' directory
   */
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(process.env.APP_PORT);
}

bootstrap();
