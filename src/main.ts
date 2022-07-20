import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { ValidationPipe } from '@nestjs/common';
//import {HttpExceptionFilter} from ""

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  //app.useGlobalPipes(new ValidationPipe());
  // app.useGlobalFilters(new HttpExceptionFilter())
  await app.listen(5000);
}
bootstrap();
