import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

/**
 * Bootstrap the Nest application.
 *
 * The following configurations are set up in this method:
 *
 * - ValidationPipe is set up as a global pipe.
 *
 * - Swagger/OpenAPI documentation is set up.
 *
 * - The application is set to listen on port 8081.
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('NestJs - Blog app API')
    .setDescription('API for blog app')
    .setTermsOfService('http://localhost:8081/terms-of-service')
    .setLicense(
      'MIT License',
      'https://github.com/git/git-scm.com/blob/main/MIT-LICENSE.txt',
    )
    .addServer('http://localhost:8081')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(8081, () => {
    console.log('Server is running on port 8081');
  });
}
bootstrap();
