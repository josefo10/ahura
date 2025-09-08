
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

const mockCatalog = {
  slug: 'test-catalog',
  knowledgeTypeEnum: [{ key: 'doc', descripcion: 'Documentation' }],
  originEnum: [{ key: 'internal', descripcion: 'Internal' }],
  assetStatusEnum: [{ key: 'active', descripcion: 'Active' }],
  criticalityEnum: [{ key: 'medium', descripcion: 'Medium' }],
  classificationLevelLevelEnum: [{ key: 'public', descripcion: 'Public' }],
  activeKnowledgeTypeEnum: [{ key: 'type1', descripcion: 'Type 1' }],
  formatEnum: [{ key: 'pdf', descripcion: 'PDF' }],
  commentStatusEnum: [{ key: 'open', descripcion: 'Open' }],
  loggerActionEnum: [{ key: 'create', descripcion: 'Create' }],
  repositoryEnum: [{ key: 'repo1', descripcion: 'Repository 1' }],
};

describe('CatalogService', () => {
  let service: CatalogService;
  let model: Model<CatalogDocument>;

  const mockCatalogModel = {
    new: jest.fn().mockResolvedValue(mockCatalog),
    constructor: jest.fn().mockResolvedValue(mockCatalog),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    exists: jest.fn(),
  };

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
    model = module.get<Model<CatalogDocument>>(getModelToken(Catalog.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getEnumKeys', () => {
    it('should return enum keys for a catalog', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCatalog),
      } as any);
      const result = await service.getEnumKeys('test-catalog');
      expect(result).toEqual({
        activeKnowledgeTypeEnum: ['type1'],
        formatEnum: ['pdf'],
        knowledgeTypeEnum: ['doc'],
        originEnum: ['internal'],
        classificationLevelLevelEnum: ['public'],
        criticalityEnum: ['medium'],
        assetStatusEnum: ['active'],
        commentStatusEnum: ['open'],
        loggerActionEnum: ['create'],
        repositoryEnum: ['repo1'],
      });
    });
  });

  describe('getEnumItems', () => {
    it('should return enum items for a catalog', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        lean: jest.fn().mockResolvedValue(mockCatalog),
      } as any);
      const result = await service.getEnumItems('test-catalog');
      expect(result).toEqual({
        activeKnowledgeTypeEnum: mockCatalog.activeKnowledgeTypeEnum,
        formatEnum: mockCatalog.formatEnum,
        knowledgeTypeEnum: mockCatalog.knowledgeTypeEnum,
        originEnum: mockCatalog.originEnum,
        classificationLevelLevelEnum: mockCatalog.classificationLevelLevelEnum,
        criticalityEnum: mockCatalog.criticalityEnum,
        assetStatusEnum: mockCatalog.assetStatusEnum,
        commentStatusEnum: mockCatalog.commentStatusEnum,
        loggerActionEnum: mockCatalog.loggerActionEnum,
        repositoryEnum: mockCatalog.repositoryEnum,
      });
    });
  });

  describe('addEnumItem', () => {
    it('should throw ConflictException if item already exists', async () => {
      jest.spyOn(model, 'exists').mockResolvedValue({ _id: 'some-id' } as any);
      await expect(service.addEnumItem('test-catalog', 'knowledgeTypeEnum', { key: 'doc' })).rejects.toThrow(ConflictException);
    });

    it('should throw NotFoundException if catalog not found', async () => {
      jest.spyOn(model, 'exists').mockResolvedValue(null);
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        lean: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.addEnumItem('test-catalog', 'knowledgeTypeEnum', { key: 'new-doc' })).rejects.toThrow(NotFoundException);
    });
  });
});
