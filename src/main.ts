import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Configurar validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Remover propiedades no definidas en DTO
      forbidNonWhitelisted: true, // Fallar si hay propiedades no permitidas
      transform: true, // Transformar automáticamente tipos
      transformOptions: {
        enableImplicitConversion: true, // Conversión automática de tipos
      },
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AHURA API')
    .setDescription('Sistema de gestión de activos de conocimiento empresarial')
    .setVersion('1.0')
    .addTag('auth', 'Autenticación y autorización')
    .addTag('assets', 'Gestión de activos de conocimiento')
    .addTag('comments', 'Comentarios sobre activos')
    .addTag('users', 'Gestión de usuarios')
    .addTag('catalogs', 'Catálogos del sistema')
    .addTag('upload', 'Subida de archivos')
    .addTag('loggers', 'Logs de auditoría')
    .addTag('app', 'Información general de la API')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Key for external access',
      },
      'api-key',
    )
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: 'swagger/json',
  });

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
