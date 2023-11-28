import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swaggerSetup';
import * as requestContext from 'request-context';
import {
  ExpressAdapter,
  NestExpressApplication,
} from '@nestjs/platform-express';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { SocketAdapter } from './socket/socket.adapter';
import * as firebase from 'firebase/app';

async function bootstrap() {
  const logger = new Logger();
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    { cors: true },
  );
  app.use(requestContext.middleware('request'));

  const corsOptions: CorsOptions = {
    origin: '*', // Adjust the origin to your needs
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  };

  const port = process.env.PORT;
  app.enableCors(corsOptions);
  app.useWebSocketAdapter(new SocketAdapter(app));
  setupSwagger(app);
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
  console.info(`see api documentation @ http://localhost:${port}/docs/`);
}
bootstrap();
