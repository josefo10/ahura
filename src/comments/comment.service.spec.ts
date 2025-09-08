import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CommentService } from './comment.service';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FindCommentsQueryDto } from './dto/find-comments.query.dto';

describe('CommentService', () => {
  let service: CommentService;
  let commentModel: Model<CommentDocument>;

  const mockComment = {
    _id: 'mockCommentId',
    assetId: 'ASSET-001',
    authorId: 'USER-001',
    userName: 'testuser',
    text: 'This is a test comment',
    createdAt: new Date(),
    status: 'active',
    save: jest.fn().mockResolvedValue(this)
  };

  const mockCommentModel = {
    new: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...mockComment, ...dto })
    })),
    constructor: jest.fn().mockImplementation((dto) => ({
      ...dto,
      save: jest.fn().mockResolvedValue({ ...mockComment, ...dto })
    })),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        {
          provide: getModelToken(Comment.name),
          useValue: mockCommentModel,
        },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    commentModel = module.get<Model<CommentDocument>>(getModelToken(Comment.name));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createCommentDto: CreateCommentDto = {
      id: 'COMMENT-001',
      assetId: 'ASSET-001',
      authorId: 'USER-001',
      userName: 'testuser',
      text: 'This is a test comment',
      status: 'active'
    };

    it('should create a comment successfully', async () => {
      const createdComment = { ...mockComment, ...createCommentDto };
      const mockSave = jest.fn().mockResolvedValue(createdComment);
      
      // Mock the constructor to return an object with save method
      (mockCommentModel as any).mockImplementation(() => ({
        ...createCommentDto,
        save: mockSave
      }));

      const result = await service.create(createCommentDto);

      expect(mockCommentModel).toHaveBeenCalledWith(createCommentDto);
      expect(mockSave).toHaveBeenCalled();
      expect(result).toEqual(createdComment);
    });

    it('should throw InternalServerErrorException when creation fails', async () => {
      const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
      mockCommentModel.constructor = jest.fn().mockImplementation(() => ({
        save: mockSave
      }));

      await expect(service.create(createCommentDto)).rejects.toThrow(InternalServerErrorException);
    });

    it('should re-throw NotFoundException', async () => {
      const mockSave = jest.fn().mockRejectedValue(new NotFoundException('Not found'));
      mockCommentModel.constructor = jest.fn().mockImplementation(() => ({
        save: mockSave
      }));

      await expect(service.create(createCommentDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    const mockQuery: FindCommentsQueryDto = {
      page: 1,
      limit: 10
    };

    it('should return paginated comments', async () => {
      const mockComments = [mockComment];
      const mockExec = jest.fn().mockResolvedValue(mockComments);
      const mockSort = jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ exec: mockExec }) }) });
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      
      mockCommentModel.find = mockFind;
      mockCommentModel.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(1)
      }));

      const result = await service.findAll(mockQuery);

      expect(result).toEqual({
        data: mockComments,
        total: 1,
        page: 1,
        totalPages: 1
      });
      expect(mockCommentModel.find).toHaveBeenCalled();
    });

    it('should apply search query when q parameter is provided', async () => {
      const queryWithSearch = { ...mockQuery, q: 'test' };
      const mockExec = jest.fn().mockResolvedValue([]);
      const mockSort = jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ exec: mockExec }) }) });
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      
      mockCommentModel.find = mockFind;
      mockCommentModel.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(0)
      }));

      await service.findAll(queryWithSearch);

      expect(mockCommentModel.find).toHaveBeenCalledWith(expect.objectContaining({
        $or: expect.any(Array)
      }));
    });

    it('should filter by assetId when provided', async () => {
      const queryWithAssetId = { ...mockQuery, assetId: 'ASSET-001' };
      const mockExec = jest.fn().mockResolvedValue([]);
      const mockSort = jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ exec: mockExec }) }) });
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      
      mockCommentModel.find = mockFind;
      mockCommentModel.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(0)
      }));

      await service.findAll(queryWithAssetId);

      expect(mockCommentModel.find).toHaveBeenCalledWith(expect.objectContaining({
        assetId: 'ASSET-001'
      }));
    });

    it('should filter by userName when provided', async () => {
      const queryWithUserName = { ...mockQuery, userName: 'testuser' };
      const mockExec = jest.fn().mockResolvedValue([]);
      const mockSort = jest.fn().mockReturnValue({ limit: jest.fn().mockReturnValue({ skip: jest.fn().mockReturnValue({ exec: mockExec }) }) });
      const mockFind = jest.fn().mockReturnValue({ sort: mockSort });
      
      mockCommentModel.find = mockFind;
      mockCommentModel.countDocuments = jest.fn().mockImplementation(() => ({
        exec: jest.fn().mockResolvedValue(0)
      }));

      await service.findAll(queryWithUserName);

      expect(mockCommentModel.find).toHaveBeenCalledWith(expect.objectContaining({
        userName: expect.objectContaining({ $regex: 'testuser', $options: 'i' })
      }));
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockComment);
      const mockFindById = jest.fn().mockReturnValue({ exec: mockExec });
      mockCommentModel.findById = mockFindById;

      const result = await service.findOne('mockCommentId');

      expect(result).toEqual(mockComment);
      expect(mockCommentModel.findById).toHaveBeenCalledWith('mockCommentId');
    });

    it('should throw NotFoundException when comment not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindById = jest.fn().mockReturnValue({ exec: mockExec });
      mockCommentModel.findById = mockFindById;

      await expect(service.findOne('NON-EXISTENT')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateCommentDto: UpdateCommentDto = {
      text: 'Updated comment text'
    };

    it('should update a comment successfully', async () => {
      const updatedComment = { ...mockComment, ...updateCommentDto };
      
      const mockExec = jest.fn().mockResolvedValue(updatedComment);
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });
      mockCommentModel.findByIdAndUpdate = mockFindByIdAndUpdate;

      const result = await service.update('mockCommentId', 'USER-001', updateCommentDto);

      expect(result).toEqual(updatedComment);
      expect(mockCommentModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockCommentId',
        updateCommentDto,
        { new: true }
      );
    });

    it('should throw NotFoundException when comment not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });
      mockCommentModel.findByIdAndUpdate = mockFindByIdAndUpdate;

      await expect(service.update('NON-EXISTENT', 'USER-001', updateCommentDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a comment successfully', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockComment);
      const mockFindByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });
      mockCommentModel.findByIdAndDelete = mockFindByIdAndDelete;

      const result = await service.remove('mockCommentId', 'USER-001');

      expect(result).toEqual({ message: 'Comment deleted successfully', deletedId: 'mockCommentId' });
      expect(mockCommentModel.findByIdAndDelete).toHaveBeenCalledWith('mockCommentId');
    });

    it('should throw NotFoundException when comment not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });
      mockCommentModel.findByIdAndDelete = mockFindByIdAndDelete;

      await expect(service.remove('NON-EXISTENT', 'USER-001')).rejects.toThrow(NotFoundException);
    });
  });

  describe('escapeRegex', () => {
    it('should escape special regex characters', () => {
      const service = new CommentService(mockCommentModel as any);
      const result = (service as any).escapeRegex('test.*+?^${}()|[]\\');
      expect(result).toBe('test\\.\\*\\+\\?\\^\\$\\{\\}\\(\\)\\|\\[\\]\\\\');
    });
  });
});