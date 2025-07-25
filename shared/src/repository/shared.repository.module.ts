import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentRepository } from './content.repository';
import { Program } from '../entities/program.entity';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature([Program]), DatabaseModule],
  providers: [ContentRepository],
  exports: [ContentRepository],
})
export class SharedRepositoryModule {}