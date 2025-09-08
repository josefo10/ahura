import { Test, TestingModule } from '@nestjs/testing';
import { LoggerController } from './logger.controller';
import { LoggerService } from './logger.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ApikeyGuard } from '../auth/guards/apikey.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('LoggerController', () => {
  let controller: LoggerController;

  const mockLoggerService = {
    create: jest.fn().mockResolvedValue({
      _id: 'mockLoggerId',
      userId: 'USER-001',
      action: 'CREATE',
      entityType: 'Asset',
      entityId: 'ASSET-001',
      description: 'Created new asset',
      timestamp: new Date()
    }),
    findAll: jest.fn().mockResolvedValue([]),
    findOne: jest.fn().mockResolvedValue({
      _id: 'mockLoggerId',
      userId: 'USER-001',
      action: 'CREATE',
      entityType: 'Asset',
      entityId: 'ASSET-001'
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoggerController],
      providers: [
        {
          provide: LoggerService,
          useValue: mockLoggerService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(ApikeyGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<LoggerController>(LoggerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});