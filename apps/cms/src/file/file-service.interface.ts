import { Express } from 'express';
import { FileDto } from './file.dto';

export interface IFileService {
  uploadFile(file: Express.Multer.File): Promise<FileDto>; // returns the file URL or path
  deleteFile(filePath: string): Promise<void>;
  getFileBuffer(filename: string): Promise<Buffer>;
}