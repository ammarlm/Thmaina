import { NestFactory } from '@nestjs/core';
import { DiscoveryModule } from './discovery.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(DiscoveryModule);

  const config = new DocumentBuilder()
    .setTitle('Thmanyah Discovery Service')
    .setDescription('API for discovering video content')
    .setVersion('1.0')
    .build();
    
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.Discovery_PORT ?? 3002);
}
bootstrap();
