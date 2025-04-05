import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RequestMethod, ValidationPipe } from '@nestjs/common';
import { envs } from '@common/env/env.validation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.setGlobalPrefix('api', {
    exclude: [
      {
        path: 'health-check',
        method: RequestMethod.GET,
      },
      {
        path: 'private/(.*)',
        method: RequestMethod.ALL,
      },
    ],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      forbidUnknownValues: true,
    }),
  );

  await app.listen(envs.appPort);

  console.log('Application ready and listen on port ' + envs.appPort);
}

bootstrap();
