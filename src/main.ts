import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ImageNotFoundMiddleware } from './middleware/image-not-found.middleware';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  app.enableCors()
  // app.useStaticAssets(join(__dirname, '../files'))
  // console.log(process.env.hello)
  // app.use(new ImageNotFoundMiddleware());
  await app.listen(process.env.APP_PORT);
}
bootstrap();
