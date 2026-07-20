import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  constructor(private configService: ConfigService) {}

  async deleteFile(filename: string, type: 'general' | 'exam' = 'general') {
    const uploadDir = type === 'exam' ? './uploads/exams' : './uploads';
    const filePath = path.join(uploadDir, filename);

    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { success: true, message: 'File deleted successfully' };
      }
      return { success: false, message: 'File not found' };
    } catch (error) {
      return { success: false, message: 'Error deleting file' };
    }
  }

  getFileUrl(filename: string, type: 'general' | 'exam' = 'general') {
    const baseUrl = this.configService.get<string>('APP_URL') || 'http://localhost:3000';
    const uploadPath = type === 'exam' ? 'uploads/exams' : 'uploads';
    return `${baseUrl}/${uploadPath}/${filename}`;
  }
}
