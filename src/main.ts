import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swaggerSetup';
import * as helmet from 'helmet';
import * as requestContext from 'request-context';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.use(requestContext.middleware('request'));

  const port = process.env.PORT;
  setupSwagger(app);
  await app.listen(port);

  logger.log(`Application listening on port ${port}`);
  console.info(`see api documentation @ http://localhost:${port}/docs/`);
}
bootstrap();
