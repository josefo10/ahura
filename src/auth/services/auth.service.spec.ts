import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../../users/user.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findByEmail: jest.fn(),
    validateUser: jest.fn()
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('test-token')
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
