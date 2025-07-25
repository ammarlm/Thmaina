import { Controller, Get, Query, Res, HttpStatus, Param } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream, statSync, existsSync } from 'fs';
import { join } from 'path';
import * as mime from 'mime-types';
import { ConfigService } from '@nestjs/config';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessagePattern, Payload } from '@nestjs/microservices';

@ApiTags('streams')
@Controller('api/streams')
export class StreamsController {
  private uploadDir: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR', join(__dirname, '..', '..', 'uploads'));
    this.baseUrl = this.configService.get('BASE_URL', 'http://localhost:3001');
  }


  @Get(':filename')
  @ApiOperation({ summary: 'Get video as stream' })
  @ApiResponse({ status: 200, description: 'Video stream' })
  async serveVideo(@Param('filename') filename: string, @Res() res: Response) {
    if (!filename) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Filename query parameter is required.' });
    }
    const filePath = join(__dirname, '..', '..', '..', '..', '..', '..', 'uploads', filename)
    if (!existsSync(filePath)) {
      return res.status(HttpStatus.NOT_FOUND).json({ message: 'File not found.' });
    }

    const stat = statSync(filePath);
    const fileSize = stat.size;
    const range = res.req.headers.range;
    const mimeType = mime.lookup(filePath) || 'application/octet-stream';

    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunkSize = end - start + 1;
      const file = createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': mimeType,
      });
      file.pipe(res);
    } else {
      res.writeHead(200, {
        'Content-Length': fileSize,
        'Content-Type': mimeType,
      });
      createReadStream(filePath).pipe(res);
    }
  }
  @MessagePattern('get_file_buffer')
  async serveVideoInternal(@Payload() filename: string): Promise<Buffer> {
    console.log('get_file_buffer', filename);
    if (!filename) {
      throw new Error('Filename parameter is required.');
    }
    const filePath = join(__dirname, '..', '..', '..', '..', '..', '..', 'uploads', filename)
    if (!existsSync(filePath)) {
      throw new Error('File not found.');
    }
    return createReadStream(filePath).read();
  }
}
