import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  dotenv.config();
  // app.useStaticAssets(join(__dirname, '../files'))
  // console.log(process.env.hello)
  await app.listen(process.env.APP_PORT);
}
bootstrap();
