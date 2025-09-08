
import { Test, TestingModule } from '@nestjs/testing';
import { CatalogModule } from './catalog.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('CatalogModule', () => {
  let catalogModule: CatalogModule;

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
        CatalogModule,
        {
          provide: getModelToken('Catalog'),
          useValue: mockModel,
        },
      ],
    }).compile();

    catalogModule = module.get<CatalogModule>(CatalogModule);
  });

  it('should be defined', () => {
    expect(catalogModule).toBeDefined();
  });
});
