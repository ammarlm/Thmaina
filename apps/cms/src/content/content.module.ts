import { Module } from '@nestjs/common';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { DatabaseModule, SharedRepositoryModule } from '@app/shared';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    DatabaseModule,
    SharedRepositoryModule,
    FileModule
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule { }