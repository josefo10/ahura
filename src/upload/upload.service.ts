import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class UploadService {
  private client: S3Client;
  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.configService.getOrThrow('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.getOrThrow('AWS_SECRET_ACCESS_KEY'),
      },
    });
  }

  async upload(fileName: string, file: Buffer) {
    const u = await this.client.send(
      new PutObjectCommand({
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: fileName,
        Body: file,
      }),
    );
    console.log({
      fileName,
      eTag: u.ETag,
      status: u.$metadata.httpStatusCode,
    });
    return u;
  }

  async getDownloadUrl(key: string) {
    const command = new GetObjectCommand({
      Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
      Key: key,
    });
    // 15 min (900 s) de validez
    const url = await getSignedUrl(this.client, command, { expiresIn: 900 });
    return { url };
  }
}
