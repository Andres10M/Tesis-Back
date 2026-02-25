//import { NestFactory } from '@nestjs/core';
//import { AppModule } from './app.module';
//import { ValidationPipe } from '@nestjs/common';

//async function bootstrap() {
  //const app = await NestFactory.create(AppModule);

  //app.useGlobalPipes(
    //new ValidationPipe({
      //transform: true,              // 🔥 OBLIGATORIO
     // whitelist: true,
     // forbidNonWhitelisted: true,
    //}),
  //);

  //app.enableCors();
  //await app.listen(3000);

 // console.log('API running on http://localhost:3000');
//}
//bootstrap();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: [
      'http://72.60.10.162',      // frontend vía IP
    ],
    credentials: true,
  });

  await app.listen(3000, '0.0.0.0');  // 🔥 CRÍTICO en Docker/VPS

  console.log('API running on port 3000');
}
bootstrap();
