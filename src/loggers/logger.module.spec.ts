
import { Test, TestingModule } from '@nestjs/testing';
import { LoggerModule } from './logger.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('LoggerModule', () => {
  let loggerModule: LoggerModule;

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
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        LoggerModule,
        {
          provide: getModelToken('Logger'),
          useValue: mockModel,
        },
      ],
    }).compile();

    loggerModule = module.get<LoggerModule>(LoggerModule);
  });

  it('should be defined', () => {
    expect(loggerModule).toBeDefined();
  });
});
