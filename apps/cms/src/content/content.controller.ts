import { Controller, Get, Post, Put, Delete, Body, Param, UploadedFile, UseInterceptors, Query, BadGatewayException, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ContentService } from './content.service';
import { CreateProgramDto } from './alter-program.dto';
import { UpdateProgramDto } from './alter-program.dto';
import { PaginationResponseDto, Program } from '@app/shared';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes } from '@nestjs/swagger';

@ApiTags('content')
@Controller('api/content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    fileFilter: (req, file, callback) => {
      if (file.mimetype.startsWith('video/')) {
        callback(null, true);
      } else {
        callback(new BadRequestException('Invalid file type'), false);
      }
    },
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit (optional)
  }))
  @ApiOperation({ summary: 'Create a new program ' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Program created', type: Program })
  create(
    @Body() createProgramDto: CreateProgramDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Program> {
    return this.contentService.create(createProgramDto, file);
  }

  @Get()
  @ApiOperation({ summary: 'Get all programs' })
  @ApiResponse({ status: 200, description: 'List of programs', type: [Program] })
  findAll(@Query('page') page: number = 1, @Query('limit') limit: number = 10): Promise<PaginationResponseDto<Program>> {
    return this.contentService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a program by ID' })
  @ApiResponse({ status: 200, description: 'Program details', type: Program })
  findOne(@Param('id') id: string): Promise<Program> {
    return this.contentService.findOne(id);
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Update a program with optional file upload' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 200, description: 'Updated program', type: Program })
  update(
    @Param('id') id: string,
    @Body() updateProgramDto: UpdateProgramDto,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Program> {
    return this.contentService.update(id, updateProgramDto, file);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a program' })
  @ApiResponse({ status: 200, description: 'Program deleted' })
  remove(@Param('id') id: string): Promise<void> {
    return this.contentService.remove(id);
  }


}