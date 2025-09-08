
import { Test, TestingModule } from '@nestjs/testing';
import { UserModule } from './user.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('UserModule', () => {
  let userModule: UserModule;

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
        UserModule,
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
      ],
    }).compile();

    userModule = module.get<UserModule>(UserModule);
  });

  it('should be defined', () => {
    expect(userModule).toBeDefined();
  });
});
