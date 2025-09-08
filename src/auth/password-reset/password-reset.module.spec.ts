
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetModule } from './password-reset.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

describe('PasswordResetModule', () => {
  let passwordResetModule: PasswordResetModule;

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
        PasswordResetModule,
        {
          provide: getModelToken('PasswordReset'),
          useValue: mockModel,
        },
        {
          provide: getModelToken('User'),
          useValue: mockModel,
        },
      ],
    }).compile();

    passwordResetModule = module.get<PasswordResetModule>(PasswordResetModule);
  });

  it('should be defined', () => {
    expect(passwordResetModule).toBeDefined();
  });
});
