import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { validationSchema } from '@app/shared';
import { StreamsController } from './stream.controller';
import { ContentModule } from './content/content.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema }),
    ContentModule
  ],
  controllers: [StreamsController]
})
export class CMSModule { }