// upload.service.ts
import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  HeadObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadService {
  private client: S3Client;
  private bucket: string;

  constructor(private readonly config: ConfigService) {
    this.client = new S3Client({
      region: this.config.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.config.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.config.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucket = this.config.getOrThrow('AWS_S3_BUCKET');
  }

  // ⬇️ PASA también el mimetype (file.mimetype)
  async upload(fileName: string, file: Buffer, mime?: string) {
    const put = await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: fileName,
        Body: file,
        ContentType: mime ?? 'application/octet-stream',
        // ContentDisposition: 'inline', // opcional como default en el objeto
        // ACL: 'private' (recomendado)
      }),
    );
    return {
      fileName,
      eTag: put.ETag,
      status: put.$metadata.httpStatusCode,
    };
  }

  // 🔽 Forzar DESCARGA
  async getDownloadUrl(key: string, expiresIn = 900) {
    const cmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition: `attachment; filename="${encodeURIComponent(key)}"; filename*=UTF-8''${encodeURIComponent(key)}`,
    });
    const url = await getSignedUrl(this.client, cmd, { expiresIn });
    return { url };
  }

  // 🔽 PREVISUALIZACIÓN (inline)
  async getPreviewUrl(key: string, expiresIn = 900) {
    // (Opcional) leer el ContentType real del objeto
    let contentType = 'application/octet-stream';
    try {
      const head = await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
      );
      if (head.ContentType) contentType = head.ContentType;
    } catch {
      // si falla HeadObject, seguimos con octet-stream
    }

    const cmd = new GetObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ResponseContentDisposition: `inline; filename="${encodeURIComponent(key)}"; filename*=UTF-8''${encodeURIComponent(key)}`,
      ResponseContentType: contentType,
    });
    const url = await getSignedUrl(this.client, cmd, { expiresIn });
    return { url };
  }
}
