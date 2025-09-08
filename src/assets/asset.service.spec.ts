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

describe('AssetService', () => {
  let service: AssetService;
  let assetModel: Model<AssetDocument>;
  let catalogService: CatalogService;

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
    save: jest.fn().mockResolvedValue(this)
  };

  const mockAssetModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...mockAsset, ...dto })
  }));

  // Add static methods
  Object.assign(mockAssetModel, {
    find: jest.fn().mockReturnValue({
      sort: jest.fn().mockReturnValue({
        limit: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue([mockAsset])
          })
        })
      })
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAsset)
    }),
    findOneAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAsset)
    }),
    findOneAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockAsset)
    }),
    countDocuments: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(1)
    }),
  });

  const mockCatalogService = {
    validateAssetEnums: jest.fn().mockResolvedValue(true),
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
    assetModel = module.get<Model<AssetDocument>>(getModelToken(Asset.name));
    catalogService = module.get<CatalogService>(CatalogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createAssetDto: CreateAssetDto = {
      id: 'ASSET-001',
      title: 'Test Asset',
      description: 'Test description',
      knowledgeType: 'Documentation',
      publishDate: new Date(),
      ownerId: 'USER-001',
      origin: 'interno',
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
      commentCount: 0
    };

    it('should create an asset successfully', async () => {
      const mockSave = jest.fn().mockResolvedValue({ ...mockAsset, ...createAssetDto });
      mockAssetModel.constructor = jest.fn().mockImplementation(() => ({
        save: mockSave
      }));

      const result = await service.create(createAssetDto);

      expect(catalogService.validateAssetEnums).toHaveBeenCalledWith(createAssetDto);
      expect(mockAssetModel.constructor).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should throw BadRequestException when validation fails', async () => {
      catalogService.validateAssetEnums = jest.fn().mockRejectedValue(new Error('Validation failed'));

      await expect(service.create(createAssetDto)).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException when catalog validation throws NotFoundException', async () => {
      catalogService.validateAssetEnums = jest.fn().mockRejectedValue(new NotFoundException('Catalog not found'));

      await expect(service.create(createAssetDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const mockQuery: FindAssetsQueryDto = {
      page: 1,
      limit: 10
    };

    it('should return paginated assets', async () => {
      const mockAssets = [mockAsset];
      const mockExec = jest.fn().mockResolvedValue(mockAssets);
      const mockSort = jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ exec: mockExec }) }) });
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      
      mockAssetModel.find = mockFind;
      mockAssetModel.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(1)
      }));

      const result = await service.findAll(mockQuery);

      expect(result).toEqual({
        data: mockAssets,
        total: 1,
        page: 1,
        totalPages: 1
      });
      expect(mockAssetModel.find).toHaveBeenCalled();
    });

    it('should apply search query when q parameter is provided', async () => {
      const queryWithSearch = { ...mockQuery, q: 'test' };
      const mockExec = jest.fn().mockResolvedValue([]);
      const mockSort = jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ exec: mockExec }) }) });
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      
      mockAssetModel.find = mockFind;
      mockAssetModel.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(0)
      }));

      await service.findAll(queryWithSearch);

      expect(mockAssetModel.find).toHaveBeenCalledWith(expect.objectContaining({
        $or: expect.any(Array)
      }));
    });
  });

  describe('findOne', () => {
    it('should return an asset by id', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockAsset);
      const mockFindOne = jest.fn().mockReturnValue({ exec: mockExec });
      mockAssetModel.findOne = mockFindOne;

      const result = await service.findOne('ASSET-001');

      expect(result).toEqual(mockAsset);
      expect(mockAssetModel.findOne).toHaveBeenCalledWith({ id: 'ASSET-001' });
    });

    it('should throw NotFoundException when asset not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindOne = jest.fn().mockReturnValue({ exec: mockExec });
      mockAssetModel.findOne = mockFindOne;

      await expect(service.findOne('NON-EXISTENT')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateAssetDto: UpdateAssetDto = {
      title: 'Updated Title',
      description: 'Updated description'
    };

    it('should update an asset successfully', async () => {
      const updatedAsset = { ...mockAsset, ...updateAssetDto };
      catalogService.validateAssetEnums = jest.fn().mockResolvedValue(true);
      
      const mockExec = jest.fn().mockResolvedValue(updatedAsset);
      const mockFindOneAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });
      mockAssetModel.findOneAndUpdate = mockFindOneAndUpdate;

      const result = await service.update('ASSET-001', updateAssetDto);

      expect(result).toEqual(updatedAsset);
      expect(mockAssetModel.findOneAndUpdate).toHaveBeenCalledWith(
        { id: 'ASSET-001' },
        expect.any(Object),
        { new: true }
      );
    });

    it('should throw NotFoundException when asset not found', async () => {
      catalogService.validateAssetEnums = jest.fn().mockResolvedValue(true);
      
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindOneAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });
      mockAssetModel.findOneAndUpdate = mockFindOneAndUpdate;

      await expect(service.update('NON-EXISTENT', updateAssetDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an asset successfully', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockAsset);
      const mockFindOneAndDelete = jest.fn().mockReturnValue({ exec: mockExec });
      mockAssetModel.findOneAndDelete = mockFindOneAndDelete;

      const result = await service.remove('ASSET-001');

      expect(result).toEqual({ message: 'Asset deleted successfully', deletedId: 'ASSET-001' });
      expect(mockAssetModel.findOneAndDelete).toHaveBeenCalledWith({ id: 'ASSET-001' });
    });

    it('should throw NotFoundException when asset not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindOneAndDelete = jest.fn().mockReturnValue({ exec: mockExec });
      mockAssetModel.findOneAndDelete = mockFindOneAndDelete;

      await expect(service.remove('NON-EXISTENT')).rejects.toThrow(NotFoundException);
    });
  });
});