import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // 또는 특정 도메인으로 설정: ['http://localhost:4200']
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger 설정
  const configs = new DocumentBuilder()
    .setTitle('Tripmate API')
    .setDescription('The Tripmate API Swagger Documentation')
    .setVersion('v1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT', // 토큰 포맷 지정
      },
      'access-token', // security name 설정
    )
    .build();
  const document = SwaggerModule.createDocument(app, configs);
  SwaggerModule.setup('swagger-ui/index.html', app, document); // swagger-ui/index.html로 접속 필요

  await app.listen(3000);
}
bootstrap();
