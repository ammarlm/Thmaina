import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PaginationResponseDto, Program, ProgramLanguage } from '@app/shared';
import { CreateProgramDto } from './alter-program.dto';
import { UpdateProgramDto } from './alter-program.dto';
import { FileService } from '../file/file.service';
import { ContentRepository } from '../../../../shared/src/repository/content.repository';
import { FileDto } from '../file/file.dto';

@Injectable()
export class ContentService {
    private readonly logger = new Logger(ContentService.name);

    constructor(
        private contentRepository: ContentRepository,
        private fileService: FileService,
    ) { }

    async create(createProgramDto: CreateProgramDto, file: Express.Multer.File): Promise<Program> {
        let contentUrl: FileDto | undefined = undefined;
        if (file) {
            contentUrl = await this.fileService.uploadFile(file);
        }
        const program = this.contentRepository.create({
            ...createProgramDto,
            publishDate: new Date(),
            duration: contentUrl?.duration || 0,
            contentUrl: contentUrl?.filename || '',
            fileName: contentUrl?.fileName || ''
        });
        this.logger.log('Creating program', program);
        return await this.contentRepository.save(program);
    }

    async findAll(page: number = 1, limit: number = 10): Promise<PaginationResponseDto<Program>> {
        return this.contentRepository.findWithPagination({}, page, limit);
    }

    async findOne(id: string): Promise<Program> {
        const program = await this.contentRepository.findOne({ where: { id } });
        if (!program) {
            throw new NotFoundException('Program not found');
        }
        return program;
    }

    async update(id: string, updateProgramDto: UpdateProgramDto, file?: Express.Multer.File): Promise<Program> {
        let contentUrl: { filename: string, duration: number } | undefined;
        const program = await this.findOne(id);
        if (file) {
            contentUrl = await this.fileService.uploadFile(file);
        }
        return await this.contentRepository.UpdateAndReturn(id,
            {
                ...updateProgramDto,
                contentUrl: contentUrl?.filename || program.contentUrl,
                duration: contentUrl?.duration || program.duration
            });
    }

    async remove(id: string): Promise<void> {
        const program = await this.findOne(id);
        if (program.contentUrl) {
            await this.fileService.deleteFile(program.contentUrl);
        }
        await this.contentRepository.DeleteOne(id);
    }

    
}