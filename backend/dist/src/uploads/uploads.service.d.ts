export declare class UploadsService {
    private readonly baseUrl;
    uploadImage(file: Express.Multer.File): {
        url: string;
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
    };
    uploadExamImage(file: Express.Multer.File): {
        url: string;
        filename: string;
        originalName: string;
        size: number;
        mimetype: string;
    };
    deleteFile(filename: string, type: 'images' | 'exams' | 'documents'): Promise<{
        success: boolean;
        message: string;
    }>;
}
