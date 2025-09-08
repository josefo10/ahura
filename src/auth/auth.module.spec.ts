
import { Test, TestingModule } from '@nestjs/testing';
import { AuthModule } from './auth.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('AuthModule', () => {
  let authModule: AuthModule;

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
        AuthModule,
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
        {
          provide: getModelToken('PasswordReset'),
          useValue: mockModel,
        },
      ],
    }).compile();

    authModule = module.get<AuthModule>(AuthModule);
  });

  it('should be defined', () => {
    expect(authModule).toBeDefined();
  });
});
