import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // global entry point
  app.setGlobalPrefix('api/v1');

  // global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // cors configuration
  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || [
      'http://localhost:3000',
      'http://localhost:8080',
    ],
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('Blog app API')
    .setDescription('API documentation for the Blog app')
    .setVersion('1.0')
    .addTag('auth', 'Authentication related endpoints')
    .addTag('users', 'User management endpoints')
    .addTag('posts', 'Blog post management endpoints')
    .addTag('comments', 'Comment management endpoints')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Refresh JWT',
        in: 'header',
      },
      'Refresh JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
    customSiteTitle: 'Blog app API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',
    customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 50px 0; }
    .swagger-ui .info .title { font-size: 2.5em; color: #007bff; }
    `,
  });

  await app.listen(process.env.PORT ?? 8080);
}

bootstrap().catch((error) => {
  Logger.error(`Application failed to start: ${error}`);
  process.exit(1);
});
