import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApikeyGuard } from '../auth/guards/apikey.guard';

describe('UploadController', () => {
  let controller: UploadController;

  const mockUploadService = {
    uploadFile: jest.fn().mockResolvedValue({
      key: 'test-file-key',
      url: 'https://test-bucket.s3.amazonaws.com/test-file-key'
    }),
    getDownloadUrl: jest.fn().mockResolvedValue('https://test-download-url'),
    getPreviewUrl: jest.fn().mockResolvedValue('https://test-preview-url')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: UploadService,
          useValue: mockUploadService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ApikeyGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});