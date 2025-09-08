
import { Test, TestingModule } from '@nestjs/testing';
import { PasswordResetController } from './password-reset.controller';
import { PasswordResetService } from './password-reset.service';
import { RequestPasswordResetDto } from './dto/request-reset.dto';
import { ConfirmPasswordResetDto } from './dto/confirm-reset.dto';

describe('PasswordResetController', () => {
  let controller: PasswordResetController;
  let service: PasswordResetService;

  const mockPasswordResetService = {
    request: jest.fn(),
    confirm: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PasswordResetController],
      providers: [
        {
          provide: PasswordResetService,
          useValue: mockPasswordResetService,
        },
      ],
    }).compile();

    controller = module.get<PasswordResetController>(PasswordResetController);
    service = module.get<PasswordResetService>(PasswordResetService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('request', () => {
    it('should call password reset service request method', async () => {
      const dto = new RequestPasswordResetDto();
      dto.email = 'test@example.com';
      await controller.request(dto);
      expect(service.request).toHaveBeenCalledWith(dto);
    });
  });

  describe('confirm', () => {
    it('should call password reset service confirm method', async () => {
      const dto = new ConfirmPasswordResetDto();
      dto.code = 'some-token';
      dto.newPassword = 'new-password';
      await controller.confirm(dto);
      expect(service.confirm).toHaveBeenCalledWith(dto);
    });
  });
});
