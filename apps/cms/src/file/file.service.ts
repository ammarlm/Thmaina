import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs, readFile } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { getVideoDurationInSeconds } from 'get-video-duration';
import { FileDto } from './file.dto';
import { IFileService } from './file-service.interface';

@Injectable()
export class FileService implements IFileService {
  private uploadDir: string;
  private baseUrl: string;

  constructor(private configService: ConfigService) {
    this.uploadDir = this.configService.get('UPLOAD_DIR', join(__dirname, '..', '..', 'uploads'));
    this.baseUrl = this.configService.get('BASE_URL', 'http://localhost:3001');
  }

  async uploadFile(file: Express.Multer.File): Promise<FileDto> {
    await fs.mkdir(this.uploadDir, { recursive: true });
    const filename = `${uuidv4()}-${file.originalname}`;
    const filePath = join(this.uploadDir, filename);
    await fs.writeFile(filePath, file.buffer);
    const duration = await getVideoDurationInSeconds(filePath);
    return { filename: `${this.baseUrl}/uploads/${filename}`, duration, fileName: filename };
  }

  async deleteFile(contentUrl: string): Promise<void> {
    const filename = contentUrl.split('/uploads/')[1];
    const filePath = join(this.uploadDir, filename);
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if (error.code !== 'ENOENT') throw error; // Ignore file not found errors
    }
  }

  async getFileBuffer(filename: string): Promise<Buffer> {
    // const filePath = join(__dirname, '..', '..', '..', '..', '..', '..', 'uploads', filename)
    // return readFile(filePath);
    throw new Error('Not implemented');
  }
}