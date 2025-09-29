import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Serve static assets
  app.useStaticAssets(join(__dirname, '..', 'public'));

  const port = process.env.PORT || 3000;
  await app.listen(port);
  
  console.log('🚀 NestJS + React SSR Application');
  console.log(`📡 Server running on: http://localhost:${port}`);
  console.log(`🔗 gRPC Backend: localhost:50051`);
}

bootstrap();
