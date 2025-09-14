import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Настройка CORS из переменной окружения
  const enableCors = process.env.ENABLE_CORS !== 'false'; // По умолчанию включено

  if (enableCors) {
    app.enableCors({
      origin: true, // Разрешить все источники
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Cache-Control'],
    });
    console.log('CORS enabled for all origins');
  } else {
    console.log('CORS disabled');
  }

  // Настраиваем глобальный ValidationPipe
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}
bootstrap();
