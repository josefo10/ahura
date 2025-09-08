import { Test, TestingModule } from '@nestjs/testing';
import { CatalogController } from './catalog.controller';
import { CatalogService } from './catalog.service';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { EnumItemDto } from './dto/enum-item.dto';
import { CatalogListName } from './dto/list-name.type';

describe('CatalogController', () => {
  let controller: CatalogController;
  let catalogService: CatalogService;

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
    updatedAt: new Date()
  };

  const mockCatalogService = {
    create: jest.fn().mockResolvedValue(mockCatalog),
    findAll: jest.fn().mockResolvedValue([mockCatalog]),
    get: jest.fn().mockResolvedValue(mockCatalog),
    update: jest.fn().mockResolvedValue({ ...mockCatalog, displayName: 'Updated Catalog' }),
    remove: jest.fn().mockResolvedValue({ message: 'Catalog deleted successfully', deletedSlug: 'test-catalog' }),
    getEnumKeys: jest.fn().mockResolvedValue(['knowledgeType', 'format', 'criticality', 'status', 'origin']),
    getEnumItems: jest.fn().mockResolvedValue([
      { key: 'doc', descripcion: 'Documentation', isActive: true }
    ]),
    addEnumItem: jest.fn().mockResolvedValue({ 
      ...mockCatalog, 
      knowledgeType: [...mockCatalog.knowledgeType, { key: 'newItem', descripcion: 'New Item', isActive: true }] 
    }),
    updateEnumItem: jest.fn().mockResolvedValue({ 
      ...mockCatalog, 
      knowledgeType: [{ key: 'doc', descripcion: 'Updated Documentation', isActive: true }] 
    }),
    removeEnumItem: jest.fn().mockResolvedValue({ 
      ...mockCatalog, 
      knowledgeType: [] 
    })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatalogController],
      providers: [
        {
          provide: CatalogService,
          useValue: mockCatalogService,
        },
      ],
    }).compile();

    controller = module.get<CatalogController>(CatalogController);
    catalogService = module.get<CatalogService>(CatalogService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should create a catalog', async () => {
      const result = await controller.create(createCatalogDto);

      expect(result).toEqual(mockCatalog);
      expect(catalogService.create).toHaveBeenCalledWith(createCatalogDto);
    });
  });

  describe('findAll', () => {
    it('should return all catalogs', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockCatalog]);
      expect(catalogService.findAll).toHaveBeenCalled();
    });
  });

  describe('get', () => {
    it('should return a catalog by slug', async () => {
      const result = await controller.get('test-catalog');

      expect(result).toEqual(mockCatalog);
      expect(catalogService.get).toHaveBeenCalledWith('test-catalog');
    });
  });

  describe('update', () => {
    const updateCatalogDto: UpdateCatalogDto = {
      knowledgeTypeEnum: [
        { key: 'manual', descripcion: 'Manual', isActive: true }
      ]
    };

    it('should update a catalog', async () => {
      const result = await controller.update('test-catalog', updateCatalogDto);

      expect(result).toEqual({ ...mockCatalog, displayName: 'Updated Catalog' });
      expect(catalogService.update).toHaveBeenCalledWith('test-catalog', updateCatalogDto);
    });
  });

  describe('remove', () => {
    it('should remove a catalog', async () => {
      const result = await controller.remove('test-catalog');

      expect(result).toEqual({ message: 'Catalog deleted successfully', deletedSlug: 'test-catalog' });
      expect(catalogService.remove).toHaveBeenCalledWith('test-catalog');
    });
  });

  describe('getEnumKeys', () => {
    it('should return enum keys for a catalog', async () => {
      const result = await controller.getEnumKeys('test-catalog');

      expect(result).toEqual(['knowledgeType', 'format', 'criticality', 'status', 'origin']);
      expect(catalogService.getEnumKeys).toHaveBeenCalledWith('test-catalog');
    });
  });

  describe('getEnumItems', () => {
    it('should return enum items for a catalog', async () => {
      const result = await controller.getEnumItems('test-catalog');

      expect(result).toEqual([{ key: 'doc', descripcion: 'Documentation', isActive: true }]);
      expect(catalogService.getEnumItems).toHaveBeenCalledWith('test-catalog');
    });
  });

  describe('addEnumItem', () => {
    const enumItem: EnumItemDto = {
      key: 'newItem',
      descripcion: 'New Item',
      isActive: true
    };

    it('should add an enum item', async () => {
      const result = await controller.addEnumItem('test-catalog', 'knowledgeType' as CatalogListName, enumItem);

      expect(result).toEqual({ 
        ...mockCatalog, 
        knowledgeType: [...mockCatalog.knowledgeType, enumItem] 
      });
      expect(catalogService.addEnumItem).toHaveBeenCalledWith('test-catalog', 'knowledgeType', enumItem);
    });
  });

  describe('updateEnumItem', () => {
    const itemUpdate = {
      descripcion: 'Updated Documentation'
    };

    it('should update an enum item', async () => {
      const result = await controller.updateEnumItem('test-catalog', 'knowledgeType' as CatalogListName, 'doc', itemUpdate);

      expect(result).toEqual({ 
        ...mockCatalog, 
        knowledgeType: [{ key: 'doc', descripcion: 'Updated Documentation', isActive: true }] 
      });
      expect(catalogService.updateEnumItem).toHaveBeenCalledWith('test-catalog', 'knowledgeType', 'doc', itemUpdate);
    });
  });

  describe('removeEnumItem', () => {
    it('should remove an enum item', async () => {
      const result = await controller.removeEnumItem('test-catalog', 'knowledgeType' as CatalogListName, 'doc');

      expect(result).toEqual({ 
        ...mockCatalog, 
        knowledgeType: [] 
      });
      expect(catalogService.removeEnumItem).toHaveBeenCalledWith('test-catalog', 'knowledgeType', 'doc');
    });
  });
});