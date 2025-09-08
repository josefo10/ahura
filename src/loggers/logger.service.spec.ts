import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LoggerService } from './logger.service';
import { Logger, LoggerDocument } from './schemas/logger.schema';

describe('LoggerService', () => {
  let service: LoggerService;

  const mockLogger = {
    _id: 'mockLoggerId',
    userId: 'USER-001',
    action: 'CREATE',
    entityType: 'Asset',
    entityId: 'ASSET-001',
    description: 'Created new asset',
    timestamp: new Date(),
    save: jest.fn().mockResolvedValue(this)
  };

  const mockLoggerModel = {
    new: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...mockLogger, ...dto })
    })),
    constructor: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...mockLogger, ...dto })
    })),
    find: jest.fn(),
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: getModelToken(Logger.name),
          useValue: mockLoggerModel,
        },
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});