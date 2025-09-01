import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File): Promise<void>;
    download(key: string): Promise<{
        url: string;
    }>;
    preview(key: string): Promise<{
        url: string;
    }>;
}
