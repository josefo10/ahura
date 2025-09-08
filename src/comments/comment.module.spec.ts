
import { Test, TestingModule } from '@nestjs/testing';
import { CommentModule } from './comment.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('CommentModule', () => {
  let commentModule: CommentModule;

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
        CommentModule,
        {
          provide: getModelToken('Comment'),
          useValue: mockModel,
        },
      ],
    }).compile();

    commentModule = module.get<CommentModule>(CommentModule);
  });

  it('should be defined', () => {
    expect(commentModule).toBeDefined();
  });
});
