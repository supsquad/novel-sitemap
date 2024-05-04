import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  /**
   * Swagger settings
   */
  const config = new DocumentBuilder()
    .setTitle('Novel API')
    .setDescription('Novel API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  /**
   * CORS settings
   */
  app.enableCors({ origin: process.env.APP_CORS_ORIGIN });

  await app.listen(process.env.APP_PORT);
}

bootstrap();
