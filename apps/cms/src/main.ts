import { NestFactory } from '@nestjs/core';
import { CMSModule } from './cms.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(CMSModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.TCP,
    options: { host: configService.get('TCP_CMS_URL'), port: parseInt(configService.get('TCP_CMS_PORT') ?? '4000') },
  });

  const config = new DocumentBuilder()
    .setTitle('Thmanyah Discovery Service')
    .setDescription('API for discovering video content')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // await app.listen(3002);
  await app.startAllMicroservices();
  await app.listen(configService.get('PORT') ?? 3001);
}
bootstrap();
