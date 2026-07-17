import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadsService {
  private readonly baseUrl = process.env.API_URL || 'http://localhost:3001';

  uploadImage(file: Express.Multer.File) {
    const imageUrl = `${this.baseUrl}/uploads/images/${file.filename}`;
    
    return {
      url: imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  uploadExamImage(file: Express.Multer.File) {
    const imageUrl = `${this.baseUrl}/uploads/exams/${file.filename}`;
    
    return {
      url: imageUrl,
      filename: file.filename,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  async deleteFile(filename: string, type: 'images' | 'exams' | 'documents') {
    const filePath = path.join(process.cwd(), 'uploads', type, filename);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        return { success: true, message: 'Arquivo deletado com sucesso' };
      }
      return { success: false, message: 'Arquivo não encontrado' };
    } catch (error) {
      return { success: false, message: 'Erro ao deletar arquivo' };
    }
  }
}
