
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PasswordResetService } from './password-reset.service';
import { PasswordReset } from './schemas/password-reset.schema';
import { User } from '../../users/schema/user.schema';
import { EmailService } from '../../common/email/email.service';
import { UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs');

describe('PasswordResetService', () => {
  let service: PasswordResetService;
  let prModel: Model<PasswordReset>;
  let userModel: Model<User>;
  let emailService: EmailService;

  const mockPasswordReset = {
    email: 'test@example.com',
    codeHash: '',
    expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
    attempts: 0,
    consumedAt: null,
    save: jest.fn().mockResolvedValue(true),
  };

  const mockUser = {
    email: 'test@example.com',
    password: 'oldHashedPassword',
    save: jest.fn().mockResolvedValue(true),
  };

  // Helper to generate hash for tests
  const generateTestHashCode = (code: string) => {
    const secret = process.env.RESET_SECRET || 'change-me-reset-secret';
    return require('crypto').createHmac('sha256', secret).update(code).digest('hex');
  };

  const mockPrModel = {
    findOne: jest.fn().mockReturnThis(),
    sort: jest.fn().mockReturnThis(),
    exec: jest.fn(),
    create: jest.fn(),
  };

  const mockUserModel = {
    findOne: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    lean: jest.fn(),
    exec: jest.fn(),
    save: jest.fn(),
  };

  const mockEmailService = {
    send: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PasswordResetService,
        {
          provide: getModelToken(PasswordReset.name),
          useValue: mockPrModel,
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    service = module.get<PasswordResetService>(PasswordResetService);
    prModel = module.get<Model<PasswordReset>>(getModelToken(PasswordReset.name));
    userModel = module.get<Model<User>>(getModelToken(User.name));
    emailService = module.get<EmailService>(EmailService);

    jest.clearAllMocks();
    process.env.RESET_CODE_LENGTH = '6';
    process.env.RESET_CODE_TTL_MIN = '15';
    process.env.RESET_MAX_ATTEMPTS = '5';
    process.env.RESET_SECRET = 'change-me-reset-secret';

    // Set the correct codeHash for mockPasswordReset
    mockPasswordReset.codeHash = generateTestHashCode('123456');
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('request', () => {
    it('should create a new password reset request if none exists', async () => {
      mockPrModel.exec.mockResolvedValue(null);
      mockUserModel.lean.mockResolvedValue(mockUser);
      await service.request({ email: 'test@example.com' });
      expect(mockPrModel.create).toHaveBeenCalled();
      expect(mockEmailService.send).toHaveBeenCalled();
    });

    it('should update an existing password reset request', async () => {
      mockPrModel.exec.mockResolvedValue(mockPasswordReset);
      mockUserModel.lean.mockResolvedValue(mockUser);
      await service.request({ email: 'test@example.com' });
      expect(mockPasswordReset.save).toHaveBeenCalled();
      expect(mockEmailService.send).toHaveBeenCalled();
    });

    it('should return a message if user does not exist', async () => {
      mockPrModel.exec.mockResolvedValue(null);
      mockUserModel.lean.mockResolvedValue(null);
      const result = await service.request({ email: 'test@example.com' });
      expect(result.message).toBe('If the email exists, a code has been sent.');
      expect(mockEmailService.send).not.toHaveBeenCalled();
    });
  });

  describe('confirm', () => {
    it('should throw NotFoundException if no active reset found', async () => {
      mockPrModel.exec.mockResolvedValue(null);
      await expect(service.confirm({ email: 'test@example.com', code: '123456', newPassword: 'new-password' })).rejects.toThrow(NotFoundException);
    });

    it('should throw UnauthorizedException if code has expired', async () => {
      const expiredRequest = { ...mockPasswordReset, expiresAt: new Date(Date.now() - 10000) };
      mockPrModel.exec.mockResolvedValue(expiredRequest);
      await expect(service.confirm({ email: 'test@example.com', code: '123456', newPassword: 'new-password' })).rejects.toThrow('Verification code has expired.');
    });

    it('should throw UnauthorizedException if too many attempts', async () => {
      const tooManyAttemptsRequest = { ...mockPasswordReset, attempts: 5 };
      mockPrModel.exec.mockResolvedValue(tooManyAttemptsRequest);
      await expect(service.confirm({ email: 'test@example.com', code: '123456', newPassword: 'new-password' })).rejects.toThrow('Too many attempts. Request a new code.');
    });

    it('should throw UnauthorizedException if code is invalid', async () => {
      const invalidCodeRequest = { ...mockPasswordReset, codeHash: 'wrongHash' };
      mockPrModel.exec.mockResolvedValue(invalidCodeRequest);
      await expect(service.confirm({ email: 'test@example.com', code: '123456', newPassword: 'new-password' })).rejects.toThrow('Invalid verification code.');
      expect(invalidCodeRequest.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      mockPrModel.exec.mockResolvedValue(mockPasswordReset);
      mockUserModel.exec.mockResolvedValue(null);
      await expect(service.confirm({ email: 'test@example.com', code: '123456', newPassword: 'new-password' })).rejects.toThrow('User not found.');
    });

    it('should reset password successfully', async () => {
      mockPrModel.exec.mockResolvedValue(mockPasswordReset);
      mockUserModel.exec.mockResolvedValue(mockUser);
      (bcrypt.genSalt as jest.Mock).mockResolvedValue('salt');
      (bcrypt.hash as jest.Mock).mockResolvedValue('newHashedPassword');

      const result = await service.confirm({ email: 'test@example.com', code: '123456', newPassword: 'new-password' });
      expect(mockUser.save).toHaveBeenCalled();
      expect(mockPasswordReset.save).toHaveBeenCalled();
      expect(result).toEqual({ ok: true });
    });
  });
});
