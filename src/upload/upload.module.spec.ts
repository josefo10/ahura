
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { UploadModule } from './upload.module';

describe('UploadModule', () => {
  let uploadModule: UploadModule;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UploadModule, ConfigModule.forRoot({ isGlobal: true })],
    }).compile();

    uploadModule = module.get<UploadModule>(UploadModule);
  });

  it('should be defined', () => {
    expect(uploadModule).toBeDefined();
  });
});
