import { ConfigService } from '@nestjs/config';
export declare class UploadService {
    private readonly config;
    private client;
    private bucket;
    constructor(config: ConfigService);
    upload(fileName: string, file: Buffer, mime?: string): Promise<{
        fileName: string;
        eTag: string | undefined;
        status: number | undefined;
    }>;
    getDownloadUrl(key: string, expiresIn?: number): Promise<{
        url: string;
    }>;
    getPreviewUrl(key: string, expiresIn?: number): Promise<{
        url: string;
    }>;
}
