import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*', // 또는 특정 도메인으로 설정: ['http://localhost:4200']
    methods: ['GET', 'POST'],
    credentials: true,
  });
  await app.listen(3000);
}
bootstrap();
