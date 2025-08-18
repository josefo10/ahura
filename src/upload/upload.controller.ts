import {
  Controller,
  UseInterceptors,
  Post,
  Get,
  Query,
  UploadedFile,
  ParseFilePipe,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { ApikeyGuard } from 'src/auth/guards/apikey.guard';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@UseGuards(ApikeyGuard)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}
  //Admin, super
  @Post()
  @Roles('administrador', 'super_administrador')
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

  // GET /upload/download?key=...
  @Get('download')
  @Roles('usuario', 'administrador', 'super_administrador')
  download(@Query('key') key: string) {
    return this.uploadService.getDownloadUrl(key);
  }

  // GET /upload/preview?key=...
  @Get('preview')
  @Roles('usuario', 'administrador', 'super_administrador')
  preview(@Query('key') key: string) {
    return this.uploadService.getPreviewUrl(key);
  }
}
