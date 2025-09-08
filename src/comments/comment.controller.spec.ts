import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FindCommentsQueryDto } from './dto/find-comments.query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: CommentService;

  const mockComment = {
    _id: 'mockCommentId',
    assetId: 'ASSET-001',
    authorId: 'USER-001',
    userName: 'testuser',
    text: 'This is a test comment',
    createdAt: new Date(),
    status: 'active'
  };

  const mockCommentService = {
    create: jest.fn().mockResolvedValue(mockComment),
    findAll: jest.fn().mockResolvedValue({
      data: [mockComment],
      total: 1,
      page: 1,
      totalPages: 1
    }),
    findOne: jest.fn().mockResolvedValue(mockComment),
    update: jest.fn().mockResolvedValue({ ...mockComment, text: 'Updated text' }),
    remove: jest.fn().mockResolvedValue({ message: 'Comment deleted successfully', deletedId: 'mockCommentId' })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: mockCommentService,
        },
      ],
    })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<CommentController>(CommentController);
    commentService = module.get<CommentService>(CommentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

    it('should create a comment', async () => {
      const result = await controller.create(createCommentDto);

      expect(result).toEqual(mockComment);
      expect(commentService.create).toHaveBeenCalledWith(createCommentDto);
    });
  });

  describe('findAll', () => {
    it('should return paginated comments', async () => {
      const query: FindCommentsQueryDto = { page: 1, limit: 10 };
      
      const result = await controller.findAll(query);

      expect(result).toEqual({
        data: [mockComment],
        total: 1,
        page: 1,
        totalPages: 1
      });
      expect(commentService.findAll).toHaveBeenCalledWith(query);
    });

    it('should handle query parameters', async () => {
      const query: FindCommentsQueryDto = { 
        page: 1, 
        limit: 10, 
        q: 'test',
        assetId: 'ASSET-001',
        userName: 'testuser',
        status: 'active'
      };
      
      await controller.findAll(query);

      expect(commentService.findAll).toHaveBeenCalledWith(query);
    });

    it('should work without query parameters', async () => {
      const query: FindCommentsQueryDto = { page: 1, limit: 10 };
      await controller.findAll(query);

      expect(commentService.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('findOne', () => {
    it('should return a single comment', async () => {
      const result = await controller.findOne('mockCommentId');

      expect(result).toEqual(mockComment);
      expect(commentService.findOne).toHaveBeenCalledWith('mockCommentId');
    });
  });

  describe('update', () => {
    const updateCommentDto: UpdateCommentDto = {
      text: 'Updated text'
    };

    it('should update a comment', async () => {
      const result = await controller.update('mockCommentId', 'USER-001', updateCommentDto);

      expect(result).toEqual({ ...mockComment, text: 'Updated text' });
      expect(commentService.update).toHaveBeenCalledWith('mockCommentId', 'USER-001', updateCommentDto);
    });
  });

  describe('remove', () => {
    it('should remove a comment', async () => {
      const result = await controller.remove('mockCommentId', 'USER-001');

      expect(result).toEqual({ message: 'Comment deleted successfully', deletedId: 'mockCommentId' });
      expect(commentService.remove).toHaveBeenCalledWith('mockCommentId', 'USER-001');
    });
  });
});