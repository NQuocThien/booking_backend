import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImageNotFoundMiddleware } from './middleware/image-not-found.middleware';
import * as dotenv from 'dotenv';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();

  const corsOptions: CorsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };
  app.enableCors(corsOptions);

  await app.listen(process.env.APP_PORT);
}
bootstrap();
