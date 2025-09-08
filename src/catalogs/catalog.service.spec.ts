import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CatalogService } from './catalog.service';
import { Catalog, CatalogDocument } from './domain/catalog.schema';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { EnumItemDto } from './dto/enum-item.dto';
import { CatalogListName } from './dto/list-name.type';

describe('CatalogService', () => {
  let service: CatalogService;
  let catalogModel: Model<CatalogDocument>;

  const mockCatalog = {
    _id: 'mockCatalogId',
    slug: 'test-catalog',
    displayName: 'Test Catalog',
    description: 'Test catalog description',
    knowledgeType: ['Documentation'],
    format: ['PDF'],
    criticality: ['low', 'medium', 'high'],
    status: ['active', 'inactive'],
    origin: ['internal', 'external'],
    updatedAt: new Date(),
    save: jest.fn().mockResolvedValue(this)
  };

  const mockCatalogModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({ ...mockCatalog, ...dto })
  }));

  // Add static methods
  Object.assign(mockCatalogModel, {
    find: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue([mockCatalog])
    }),
    findOne: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockCatalog)
    }),
    findOneAndUpdate: jest.fn().mockReturnValue({
      lean: jest.fn().mockResolvedValue(mockCatalog)
    }),
    findOneAndDelete: jest.fn().mockResolvedValue(mockCatalog),
    deleteOne: jest.fn().mockResolvedValue({ deletedCount: 1 }),
    exists: jest.fn().mockResolvedValue(null),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatalogService,
        {
          provide: getModelToken(Catalog.name),
          useValue: mockCatalogModel,
        },
      ],
    }).compile();

    service = module.get<CatalogService>(CatalogService);
    catalogModel = module.get<Model<CatalogDocument>>(getModelToken(Catalog.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCatalogDto: CreateCatalogDto = {
      slug: 'test-catalog',
      knowledgeTypeEnum: [
        { key: 'documentation', descripcion: 'Documentation', isActive: true }
      ],
      formatEnum: [
        { key: 'pdf', descripcion: 'PDF', isActive: true }
      ]
    };

    it('should create a catalog successfully', async () => {
      mockCatalogModel.exists = jest.fn().mockResolvedValue(null);
      
      const mockSave = jest.fn().mockResolvedValue({ ...mockCatalog, ...createCatalogDto });
      mockCatalogModel.constructor = jest.fn().mockImplementation(() => ({
        save: mockSave
      }));

      const result = await service.create(createCatalogDto);

      expect(mockCatalogModel.exists).toHaveBeenCalledWith({ slug: createCatalogDto.slug });
      expect(mockCatalogModel.constructor).toHaveBeenCalledWith({
        ...createCatalogDto,
        updatedAt: expect.any(Date)
      });
      expect(result).toBeDefined();
    });

    it('should throw ConflictException when catalog with slug already exists', async () => {
      mockCatalogModel.exists = jest.fn().mockResolvedValue({ _id: 'existing' });

      await expect(service.create(createCatalogDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all catalogs', async () => {
      const mockCatalogs = [mockCatalog];
      mockCatalogModel.find = jest.fn().mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCatalogs)
      });

      const result = await service.findAll();

      expect(result).toEqual(mockCatalogs);
      expect(mockCatalogModel.find).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return a catalog by slug', async () => {
      mockCatalogModel.findOne = jest.fn().mockResolvedValue(mockCatalog);

      const result = await service.get('test-catalog');

      expect(result).toEqual(mockCatalog);
      expect(mockCatalogModel.findOne).toHaveBeenCalledWith({ slug: 'test-catalog' });
    });

    it('should use default slug when none provided', async () => {
      mockCatalogModel.findOne = jest.fn().mockResolvedValue(mockCatalog);

      await service.get();

      expect(mockCatalogModel.findOne).toHaveBeenCalledWith({ slug: 'default' });
    });

    it('should throw NotFoundException when catalog not found', async () => {
      mockCatalogModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.get('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateCatalogDto: UpdateCatalogDto = {
      knowledgeTypeEnum: [
        { key: 'updated', descripcion: 'Updated Knowledge Type', isActive: true }
      ]
    };

    it('should update a catalog successfully', async () => {
      const updatedCatalog = { ...mockCatalog, ...updateCatalogDto };
      mockCatalogModel.findOneAndUpdate = jest.fn().mockResolvedValue(updatedCatalog);

      const result = await service.update('test-catalog', updateCatalogDto);

      expect(result).toEqual(updatedCatalog);
      expect(mockCatalogModel.findOneAndUpdate).toHaveBeenCalledWith(
        { slug: 'test-catalog' },
        { ...updateCatalogDto, updatedAt: expect.any(Date) },
        { new: true }
      );
    });

    it('should throw NotFoundException when catalog not found', async () => {
      mockCatalogModel.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(service.update('nonexistent', updateCatalogDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a catalog successfully', async () => {
      mockCatalogModel.findOneAndDelete = jest.fn().mockResolvedValue(mockCatalog);

      const result = await service.remove('test-catalog');

      expect(result).toEqual({ message: 'Catalog deleted successfully', deletedSlug: 'test-catalog' });
      expect(mockCatalogModel.findOneAndDelete).toHaveBeenCalledWith({ slug: 'test-catalog' });
    });

    it('should throw NotFoundException when catalog not found', async () => {
      mockCatalogModel.findOneAndDelete = jest.fn().mockResolvedValue(null);

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getEnumKeys', () => {
    it('should return enum keys for a catalog', async () => {
      mockCatalogModel.findOne = jest.fn().mockResolvedValue(mockCatalog);

      const result = await service.getEnumKeys('test-catalog');

      expect(result).toEqual(['knowledgeType', 'format', 'criticality', 'status', 'origin']);
      expect(mockCatalogModel.findOne).toHaveBeenCalledWith({ slug: 'test-catalog' });
    });

    it('should throw NotFoundException when catalog not found', async () => {
      mockCatalogModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.getEnumKeys('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getEnumItems', () => {
    const catalogWithEnumItems = {
      ...mockCatalog,
      knowledgeType: [
        { key: 'doc', descripcion: 'Documentation', isActive: true },
        { key: 'manual', descripcion: 'Manual', isActive: true }
      ]
    };

    it('should return enum items for a catalog', async () => {
      mockCatalogModel.findOne = jest.fn().mockResolvedValue(catalogWithEnumItems);

      const result = await service.getEnumItems('test-catalog');

      expect(result).toEqual(catalogWithEnumItems.knowledgeType);
      expect(mockCatalogModel.findOne).toHaveBeenCalledWith({ slug: 'test-catalog' });
    });
  });

  describe('addEnumItem', () => {
    const enumItem: EnumItemDto = {
      key: 'newItem',
      descripcion: 'New Item',
      isActive: true
    };

    it('should add enum item successfully', async () => {
      const catalogWithNewItem = {
        ...mockCatalog,
        knowledgeType: [...mockCatalog.knowledgeType, enumItem]
      };
      
      mockCatalogModel.findOne = jest.fn().mockResolvedValue(mockCatalog);
      mockCatalogModel.findOneAndUpdate = jest.fn().mockResolvedValue(catalogWithNewItem);

      const result = await service.addEnumItem('test-catalog', 'knowledgeType' as CatalogListName, enumItem);

      expect(result).toEqual(catalogWithNewItem);
      expect(mockCatalogModel.findOneAndUpdate).toHaveBeenCalled();
    });

    it('should throw NotFoundException when catalog not found', async () => {
      mockCatalogModel.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.addEnumItem('nonexistent', 'knowledgeType' as CatalogListName, enumItem))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('updateEnumItem', () => {
    const itemUpdate = {
      descripcion: 'Updated Description',
      isActive: false
    };

    it('should update enum item successfully', async () => {
      const catalogWithItems = {
        ...mockCatalog,
        knowledgeType: [
          { key: 'doc', descripcion: 'Documentation', isActive: true }
        ]
      };

      mockCatalogModel.findOne = jest.fn().mockResolvedValue(catalogWithItems);
      mockCatalogModel.findOneAndUpdate = jest.fn().mockResolvedValue({
        ...catalogWithItems,
        knowledgeType: [
          { key: 'doc', descripcion: 'Updated Description', isActive: false }
        ]
      });

      const result = await service.updateEnumItem('test-catalog', 'knowledgeType' as CatalogListName, 'doc', itemUpdate);

      expect(result).toBeDefined();
      expect(mockCatalogModel.findOneAndUpdate).toHaveBeenCalled();
    });
  });

  describe('removeEnumItem', () => {
    it('should remove enum item successfully', async () => {
      const catalogWithItems = {
        ...mockCatalog,
        knowledgeType: [
          { key: 'doc', descripcion: 'Documentation', isActive: true },
          { key: 'manual', descripcion: 'Manual', isActive: true }
        ]
      };

      mockCatalogModel.findOne = jest.fn().mockResolvedValue(catalogWithItems);
      mockCatalogModel.findOneAndUpdate = jest.fn().mockResolvedValue({
        ...catalogWithItems,
        knowledgeType: [
          { key: 'manual', descripcion: 'Manual', isActive: true }
        ]
      });

      const result = await service.removeEnumItem('test-catalog', 'knowledgeType' as CatalogListName, 'doc');

      expect(result).toBeDefined();
      expect(mockCatalogModel.findOneAndUpdate).toHaveBeenCalled();
    });
  });
});