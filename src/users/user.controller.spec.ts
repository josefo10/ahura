import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApikeyGuard } from '../auth/guards/apikey.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;

  const mockUser = {
    _id: 'mockUserId',
    name: 'Test User',
    email: 'test@example.com',
    role: 'user'
  };

  const mockUserService = {
    create: jest.fn().mockResolvedValue(mockUser),
    findAll: jest.fn().mockResolvedValue([mockUser]),
    findOne: jest.fn().mockResolvedValue(mockUser),
    update: jest.fn().mockResolvedValue({ ...mockUser, name: 'Updated User' }),
    remove: jest.fn().mockResolvedValue({ message: 'Usuario eliminado exitosamente', deletedId: 'mockUserId' })
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    })
      .overrideGuard(ApikeyGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(JwtAuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideGuard(RolesGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      id: 'USER-001',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    };

    it('should create a user', async () => {
      const result = await controller.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(userService.create).toHaveBeenCalledWith(createUserDto);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = await controller.findAll();

      expect(result).toEqual([mockUser]);
      expect(userService.findAll).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a single user', async () => {
      const result = await controller.findOne('mockUserId');

      expect(result).toEqual(mockUser);
      expect(userService.findOne).toHaveBeenCalledWith('mockUserId');
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated User',
      email: 'updated@example.com'
    };

    it('should update a user', async () => {
      const result = await controller.update('mockUserId', updateUserDto);

      expect(result).toEqual({ ...mockUser, name: 'Updated User' });
      expect(userService.update).toHaveBeenCalledWith('mockUserId', updateUserDto);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      const result = await controller.remove('mockUserId');

      expect(result).toEqual({ message: 'Usuario eliminado exitosamente', deletedId: 'mockUserId' });
      expect(userService.remove).toHaveBeenCalledWith('mockUserId');
    });
  });
});