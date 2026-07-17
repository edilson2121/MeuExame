import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
    }>;
    uploadExamImage(file: Express.Multer.File): Promise<{
        url: string;
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
    }>;
}
