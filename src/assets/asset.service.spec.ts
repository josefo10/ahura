import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Model } from 'mongoose';
import { AssetService } from './asset.service';
import { Asset, AssetDocument } from './schemas/asset.schema';
import { CatalogService } from '../catalogs/catalog.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { FindAssetsQueryDto } from './dto/find-assets.query.dto';

const mockAsset = {
  _id: 'mockId',
  id: 'ASSET-001',
  title: 'Test Asset',
  description: 'Test description',
  knowledgeType: 'Documentation',
  publishDate: new Date(),
  ownerId: 'USER-001',
  availability: {
    accessibility: true,
    location: 'Repository'
  },
  classificationLevel: {
    level: 'Public'
  },
  keywords: ['test'],
  viewCount: 0,
  downloadCount: 0,
  commentCount: 0,
};

describe('AssetService', () => {
  let service: AssetService;
  let model: Model<AssetDocument>;
  let catalogService: CatalogService;

  const mockAssetModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue(mockAsset),
  }));
  
  // Add static methods to the mock constructor function
  Object.assign(mockAssetModel, {
    find: jest.fn(() => ({
      sort: jest.fn(() => ({
        limit: jest.fn(() => ({
          skip: jest.fn(() => ({
            exec: jest.fn(),
          })),
        })),
      })),
    })),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    findOneAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
    create: jest.fn(),
  });

  const mockCatalogService = {
    validateAssetEnums: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssetService,
        {
          provide: getModelToken(Asset.name),
          useValue: mockAssetModel,
        },
        {
          provide: CatalogService,
          useValue: mockCatalogService,
        },
      ],
    }).compile();

    service = module.get<AssetService>(AssetService);
    model = module.get<Model<AssetDocument>>(getModelToken(Asset.name));
    catalogService = module.get<CatalogService>(CatalogService);
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create an asset', async () => {
      const createAssetDto: CreateAssetDto = {
        id: '1',
        title: 'test',
        description: 'test',
        knowledgeType: 'test',
        publishDate: '2025-09-04T00:00:00.000Z',
        ownerId: '1',
        origin: 'test',
        availability: {
          accessibility: true,
          location: 'test'
        },
        classificationLevel: {
          level: 'test'
        },
        viewCount: 0,
        downloadCount: 0,
        commentCount: 0,
        keywords: []
      };
      
      const result = await service.create(createAssetDto);
      expect(result).toEqual(mockAsset);
    });
  });

  describe('findAll', () => {
    it('should return paginated assets', async () => {
      const query: FindAssetsQueryDto = { page: 1, limit: 10 };
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockAsset]),
      } as any);
      jest.spyOn(model, 'countDocuments').mockResolvedValue(1);
      const result = await service.findAll(query);
      expect(result).toEqual({ items: [mockAsset], total: 1, page: 1, limit: 10 });
    });
  });

  describe('findOne', () => {
    it('should return an asset by id', async () => {
      const findOneSpy = jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAsset),
      } as any);
      const result = await service.findOne('some-id');
      expect(result).toEqual(mockAsset);
    });

    it('should throw NotFoundException if asset not found', async () => {
      const findOneSpy = jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.findOne('some-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update an asset', async () => {
      const updateAssetDto: UpdateAssetDto = { title: 'updated' };
      const updateSpy = jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAsset),
      } as any);
      const result = await service.update('some-id', updateAssetDto);
      expect(result).toEqual(mockAsset);
    });

    it('should throw NotFoundException if asset not found', async () => {
      const updateSpy = jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.update('some-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an asset', async () => {
      const removeSpy = jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockAsset),
      } as any);
      const result = await service.remove('some-id');
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if asset not found', async () => {
      const removeSpy = jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.remove('some-id')).rejects.toThrow(NotFoundException);
    });
  });
});