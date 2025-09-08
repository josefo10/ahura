import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import { CommentService } from './comment.service';
import { Comment, CommentDocument } from './schemas/comment.schema';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FindCommentsQueryDto } from './dto/find-comments.query.dto';

const mockComment = {
  _id: 'mockCommentId',
  id: 'COMMENT-001',
  assetId: 'ASSET-001',
  authorId: 'USER-001',
  userName: 'testuser',
  text: 'This is a test comment',
  createdAt: new Date(),
  status: 'active',
  save: jest.fn().mockResolvedValue(true),
};

describe('CommentService', () => {
  let service: CommentService;
  let model: Model<CommentDocument>;

  const mockCommentModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue(mockComment),
  }));
  
  // Add static methods to the mock constructor function
  Object.assign(mockCommentModel, {
    find: jest.fn(() => mockCommentModel),
    findOne: jest.fn(() => mockCommentModel),
    findById: jest.fn(() => mockCommentModel),
    findByIdAndUpdate: jest.fn(() => mockCommentModel),
    findOneAndUpdate: jest.fn(() => mockCommentModel),
    findByIdAndDelete: jest.fn(() => ({ exec: jest.fn() })),
    findOneAndDelete: jest.fn(),
    countDocuments: jest.fn(() => mockCommentModel),
    sort: jest.fn(() => mockCommentModel),
    skip: jest.fn(() => mockCommentModel),
    limit: jest.fn(() => mockCommentModel),
    exec: jest.fn(),
    create: jest.fn(),
  });

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
    model = module.get<Model<CommentDocument>>(getModelToken(Comment.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a comment', async () => {
      const createCommentDto: CreateCommentDto = { id: 'COMMENT-001', assetId: 'ASSET-001', authorId: 'USER-001', userName: 'testuser', text: 'This is a test comment', status: 'active' };
      const result = await service.create(createCommentDto);
      expect(result).toEqual(mockComment);
    });

    it('should throw InternalServerErrorException when creation fails', async () => {
      // Mock the constructor to return an instance with a failing save method
      (mockCommentModel as any).mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Database error')),
      }));
      
      const createCommentDto: CreateCommentDto = { id: 'COMMENT-001', assetId: 'ASSET-001', authorId: 'USER-001', userName: 'testuser', text: 'This is a test comment', status: 'active' };
      await expect(service.create(createCommentDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('should return paginated comments', async () => {
      const query: FindCommentsQueryDto = { page: 1, limit: 10 };
      jest.spyOn(model, 'find').mockReturnValue({
        sort: jest.fn().mockReturnValue({
          skip: jest.fn().mockReturnValue({
            limit: jest.fn().mockReturnValue({
              exec: jest.fn().mockResolvedValue([mockComment]),
            }),
          }),
        }),
      } as any);
      jest.spyOn(model, 'countDocuments').mockReturnValue({
        exec: jest.fn().mockResolvedValue(1),
      } as any);

      const result = await service.findAll(query);

      expect(result).toEqual({
        data: [mockComment],
        total: 1,
        page: 1,
        totalPages: 1,
      });
      expect(model.find).toHaveBeenCalled();
      expect(model.countDocuments).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a comment by id', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockComment),
      } as any);
      const result = await service.findOne('COMMENT-001');
      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException when comment not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.findOne('NON-EXISTENT')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException when findOne fails', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      } as any);
      await expect(service.findOne('COMMENT-001')).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('update', () => {
    it('should update a comment successfully', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockComment),
      } as any);
      const updateCommentDto: UpdateCommentDto = { text: 'Updated text' };
      const result = await service.update('COMMENT-001', 'USER-001', updateCommentDto);
      expect(result).toEqual(mockComment);
    });

    it('should throw NotFoundException when comment not found', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      const updateCommentDto: UpdateCommentDto = { text: 'Updated text' };
      await expect(service.update('NON-EXISTENT', 'USER-001', updateCommentDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException when update fails', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      } as any);
      const updateCommentDto: UpdateCommentDto = { text: 'Updated text' };
      await expect(service.update('COMMENT-001', 'USER-001', updateCommentDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('remove', () => {
    it('should remove a comment successfully', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockComment),
      } as any);
      await service.remove('COMMENT-001', 'USER-001');
      expect(model.findOneAndDelete).toHaveBeenCalledWith({ id: 'COMMENT-001', authorId: 'USER-001' });
    });

    it('should throw NotFoundException when comment not found', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.remove('NON-EXISTENT', 'USER-001')).rejects.toThrow(NotFoundException);
    });

    it('should throw InternalServerErrorException when remove fails', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      } as any);
      await expect(service.remove('COMMENT-001', 'USER-001')).rejects.toThrow(InternalServerErrorException);
    });
  });
});