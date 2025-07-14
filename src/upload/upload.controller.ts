import {
  Controller,
  UseInterceptors,
  Post,
  Get,
  Query,
  UploadedFile,
  ParseFilePipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          // Add your validation logic here
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    await this.uploadService.upload(file.originalname, file.buffer);
  }

  @Get('get')
  async download(@Query('key') key: string): Promise<{ url: string }> {
    return this.uploadService.getDownloadUrl(key);
  }
}
