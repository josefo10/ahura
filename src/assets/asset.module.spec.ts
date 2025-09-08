
import { Test, TestingModule } from '@nestjs/testing';
import { AssetModule } from './asset.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('AssetModule', () => {
  let assetModule: AssetModule;

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
        AssetModule,
        {
          provide: getModelToken('Asset'),
          useValue: mockModel,
        },
      ],
    }).compile();

    assetModule = module.get<AssetModule>(AssetModule);
  });

  it('should be defined', () => {
    expect(assetModule).toBeDefined();
  });
});
