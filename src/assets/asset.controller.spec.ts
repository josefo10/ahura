import { Test, TestingModule } from '@nestjs/testing';
import { AssetController } from './asset.controller';
import { AssetService } from './asset.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { FindAssetsQueryDto } from './dto/find-assets.query.dto';
import { ApikeyGuard } from '../auth/guards/apikey.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('AssetController', () => {
  let controller: AssetController;
  let assetService: AssetService;

  const mockAsset = {
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
    commentCount: 0
  };

  const mockAssetService = {
    create: jest.fn().mockResolvedValue(mockAsset),
    findAll: jest.fn().mockResolvedValue({
      data: [mockAsset],
      total: 1,
      page: 1,
      totalPages: 1
    }),
    findOne: jest.fn().mockResolvedValue(mockAsset),
    update: jest.fn().mockResolvedValue({ ...mockAsset, title: 'Updated Title' }),
    remove: jest.fn().mockResolvedValue({ message: 'Asset deleted successfully', deletedId: 'ASSET-001' })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AssetController],
      providers: [
        {
          provide: AssetService,
          useValue: mockAssetService,
        },
      ],
    })
      .overrideGuard(ApikeyGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<AssetController>(AssetController);
    assetService = module.get<AssetService>(AssetService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createAssetDto: CreateAssetDto = {
      id: 'ASSET-001',
      title: 'Test Asset',
      description: 'Test description',
      knowledgeType: 'Documentation',
      publishDate: '2025-09-04T00:00:00.000Z',
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

    it('should create an asset', async () => {
      const result = await controller.create(createAssetDto);

      expect(result).toEqual(mockAsset);
      expect(assetService.create).toHaveBeenCalledWith(createAssetDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated assets', async () => {
      const query: FindAssetsQueryDto = { page: 1, limit: 10 };
      
      const result = await controller.findAll(query);

      expect(result).toEqual({
        data: [mockAsset],
        total: 1,
        page: 1,
        totalPages: 1
      });
      expect(assetService.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle query parameters', async () => {
      const query: FindAssetsQueryDto = { 
        page: 1, 
        limit: 10, 
        q: 'test',
        title: 'Test Asset',
        knowledgeType: 'Documentation'
      };
      
      await controller.findAll(query);

      expect(assetService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single asset', async () => {
      const result = await controller.findOne('ASSET-001');

      expect(result).toEqual(mockAsset);
      expect(assetService.findOne).toHaveBeenCalledWith('ASSET-001');
    });
  });

  describe('update', () => {
    const updateAssetDto: UpdateAssetDto = {
      title: 'Updated Title',
      description: 'Updated description'
    };

    it('should update an asset', async () => {
      const result = await controller.update('ASSET-001', updateAssetDto);

      expect(result).toEqual({ ...mockAsset, title: 'Updated Title' });
      expect(assetService.update).toHaveBeenCalledWith('ASSET-001', updateAssetDto);
    });
  });

  describe('remove', () => {
    it('should remove an asset', async () => {
      const result = await controller.remove('ASSET-001');

      expect(result).toEqual({ message: 'Asset deleted successfully', deletedId: 'ASSET-001' });
      expect(assetService.remove).toHaveBeenCalledWith('ASSET-001');
    });
  });
});