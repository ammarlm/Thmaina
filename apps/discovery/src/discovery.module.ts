import { Module } from '@nestjs/common';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, SharedRepositoryModule, validationSchema } from '@app/shared';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    ClientsModule.register([
      {
        name: 'CMS_SERVICE',
        transport: Transport.TCP,
        options: { host: process.env.TCP_CMS_URL, port: parseInt(process.env.TCP_CMS_PORT ?? '4000') }, // match CMS microservice config
      },  
    ]),
    DatabaseModule,
    SharedRepositoryModule
  ],
  controllers: [DiscoveryController],
  providers: [DiscoveryService],
})
export class DiscoveryModule { }
