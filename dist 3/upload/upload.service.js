"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const client_s3_1 = require("@aws-sdk/client-s3");
const config_1 = require("@nestjs/config");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
let UploadService = class UploadService {
    config;
    client;
    bucket;
    constructor(config) {
        this.config = config;
        this.client = new client_s3_1.S3Client({
            region: this.config.getOrThrow('AWS_S3_REGION'),
            credentials: {
                accessKeyId: this.config.getOrThrow('AWS_ACCESS_KEY_ID'),
                secretAccessKey: this.config.getOrThrow('AWS_SECRET_ACCESS_KEY'),
            },
        });
        this.bucket = this.config.getOrThrow('AWS_S3_BUCKET');
    }
    async upload(fileName, file, mime) {
        const put = await this.client.send(new client_s3_1.PutObjectCommand({
            Bucket: this.bucket,
            Key: fileName,
            Body: file,
            ContentType: mime ?? 'application/octet-stream',
        }));
        return {
            fileName,
            eTag: put.ETag,
            status: put.$metadata.httpStatusCode,
        };
    }
    async getDownloadUrl(key, expiresIn = 900) {
        const cmd = new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ResponseContentDisposition: `attachment; filename="${encodeURIComponent(key)}"; filename*=UTF-8''${encodeURIComponent(key)}`,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.client, cmd, { expiresIn });
        return { url };
    }
    async getPreviewUrl(key, expiresIn = 900) {
        let contentType = 'application/octet-stream';
        try {
            const head = await this.client.send(new client_s3_1.HeadObjectCommand({ Bucket: this.bucket, Key: key }));
            if (head.ContentType)
                contentType = head.ContentType;
        }
        catch {
        }
        const cmd = new client_s3_1.GetObjectCommand({
            Bucket: this.bucket,
            Key: key,
            ResponseContentDisposition: `inline; filename="${encodeURIComponent(key)}"; filename*=UTF-8''${encodeURIComponent(key)}`,
            ResponseContentType: contentType,
        });
        const url = await (0, s3_request_presigner_1.getSignedUrl)(this.client, cmd, { expiresIn });
        return { url };
    }
};
exports.UploadService = UploadService;
exports.UploadService = UploadService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], UploadService);
//# sourceMappingURL=upload.service.js.map