
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('AppModule', () => {
  let appModule: AppModule;

  const mockModel = {
    find: jest.fn(),
    findOne: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    create: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
        {
          provide: getModelToken('Logger'),
          useValue: mockModel,
        },
        {
          provide: getModelToken('Comment'),
          useValue: mockModel,
        },
        {
          provide: getModelToken('Asset'),
          useValue: mockModel,
        },
        {
          provide: getModelToken('Catalog'),
          useValue: mockModel,
        },
        {
          provide: getModelToken('PasswordReset'),
          useValue: mockModel,
        },
      ],
    }).compile();

    appModule = app.get<AppModule>(AppModule);
  });

  it('should be defined', () => {
    expect(appModule).toBeDefined();
  });
});
