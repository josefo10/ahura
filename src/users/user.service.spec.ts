import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { UserService } from './user.service';
import { User, UserDocument } from './schema/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let userModel: Model<UserDocument>;

  const mockUser = {
    _id: 'mockUserId',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    role: 'user',
    save: jest.fn().mockResolvedValue(this),
    toJSON: jest.fn().mockReturnValue({
      _id: 'mockUserId',
      name: 'Test User',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: 'user'
    })
  };

  const mockUserModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    password: dto.password,
    role: 'user',
    save: jest.fn().mockResolvedValue({ 
      ...mockUser, 
      ...dto, 
      toJSON: () => ({
        _id: 'mockUserId',
        name: dto.name,
        email: dto.email,
        role: 'user'
      })
    })
  }));

  // Add static methods
  Object.assign(mockUserModel, {
    find: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue([mockUser])
    }),
    findById: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser)
    }),
    findByIdAndUpdate: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser)
    }),
    findByIdAndDelete: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser)
    }),
    findOne: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(null)
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = module.get<Model<UserDocument>>(getModelToken(User.name));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      id: 'USER-001',
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user'
    };

    it('should create a user successfully', async () => {
      const hashedPassword = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const mockSave = jest.fn().mockResolvedValue({
        ...mockUser,
        ...createUserDto,
        password: hashedPassword,
        role: 'user',
        toJSON: jest.fn().mockReturnValue({
          _id: 'mockUserId',
          name: 'Test User',
          email: 'test@example.com',
          role: 'user'
        })
      });

      mockUserModel.constructor = jest.fn().mockImplementation(() => ({
        password: createUserDto.password,
        role: undefined,
        save: mockSave
      }));

      const result = await service.create(createUserDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(mockUserModel.constructor).toHaveBeenCalledWith(createUserDto);
      expect(result).toBeDefined();
      expect(result.password).toBeUndefined(); // Password should be removed from response
    });

    it('should throw InternalServerErrorException when creation fails', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      
      const mockSave = jest.fn().mockRejectedValue(new Error('Database error'));
      mockUserModel.constructor = jest.fn().mockImplementation(() => ({
        password: createUserDto.password,
        role: undefined,
        save: mockSave
      }));

      await expect(service.create(createUserDto)).rejects.toThrow(InternalServerErrorException);
    });

    it('should re-throw NotFoundException', async () => {
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      
      const mockSave = jest.fn().mockRejectedValue(new NotFoundException('Not found'));
      mockUserModel.constructor = jest.fn().mockImplementation(() => ({
        password: createUserDto.password,
        role: undefined,
        save: mockSave
      }));

      await expect(service.create(createUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      const mockExec = jest.fn().mockResolvedValue(mockUsers);
      const mockFind = jest.fn().mockReturnValue({ exec: mockExec });
      
      mockUserModel.find = mockFind;

      const result = await service.findAll();

      expect(result).toEqual(mockUsers);
      expect(mockUserModel.find).toHaveBeenCalled();
    });

    it('should throw InternalServerErrorException when query fails', async () => {
      const mockExec = jest.fn().mockRejectedValue(new Error('Database error'));
      const mockFind = jest.fn().mockReturnValue({ exec: mockExec });
      
      mockUserModel.find = mockFind;

      await expect(service.findAll()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockUser);
      const mockFindById = jest.fn().mockReturnValue({ exec: mockExec });
      mockUserModel.findById = mockFindById;

      const result = await service.findOne('mockUserId');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findById).toHaveBeenCalledWith('mockUserId');
    });

    it('should throw NotFoundException when user not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindById = jest.fn().mockReturnValue({ exec: mockExec });
      mockUserModel.findById = mockFindById;

      await expect(service.findOne('NON-EXISTENT')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockUser);
      const mockFindOne = jest.fn().mockReturnValue({ exec: mockExec });
      mockUserModel.findOne = mockFindOne;

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
      expect(mockUserModel.findOne).toHaveBeenCalledWith({ email: 'test@example.com' });
    });

    it('should return null when user not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindOne = jest.fn().mockReturnValue({ exec: mockExec });
      mockUserModel.findOne = mockFindOne;

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateUserDto: UpdateUserDto = {
      name: 'Updated Name',
      email: 'updated@example.com'
    };

    it('should update a user successfully', async () => {
      const updatedUser = { ...mockUser, ...updateUserDto };
      
      const mockExec = jest.fn().mockResolvedValue(updatedUser);
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });
      mockUserModel.findByIdAndUpdate = mockFindByIdAndUpdate;

      const result = await service.update('mockUserId', updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockUserId',
        updateUserDto,
        { new: true }
      );
    });

    it('should hash password when updating password', async () => {
      const updateWithPassword = { ...updateUserDto, password: 'newPassword' };
      const hashedPassword = 'newHashedPassword';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);

      const updatedUser = { ...mockUser, ...updateWithPassword, password: hashedPassword };
      
      const mockExec = jest.fn().mockResolvedValue(updatedUser);
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });
      mockUserModel.findByIdAndUpdate = mockFindByIdAndUpdate;

      await service.update('mockUserId', updateWithPassword);

      expect(bcrypt.hash).toHaveBeenCalledWith('newPassword', 10);
      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'mockUserId',
        { ...updateWithPassword, password: hashedPassword },
        { new: true }
      );
    });

    it('should throw NotFoundException when user not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindByIdAndUpdate = jest.fn().mockReturnValue({ exec: mockExec });
      mockUserModel.findByIdAndUpdate = mockFindByIdAndUpdate;

      await expect(service.update('NON-EXISTENT', updateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user successfully', async () => {
      const mockExec = jest.fn().mockResolvedValue(mockUser);
      const mockFindByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });
      mockUserModel.findByIdAndDelete = mockFindByIdAndDelete;

      const result = await service.remove('mockUserId');

      expect(result).toEqual({ message: 'Usuario eliminado exitosamente', deletedId: 'mockUserId' });
      expect(mockUserModel.findByIdAndDelete).toHaveBeenCalledWith('mockUserId');
    });

    it('should throw NotFoundException when user not found', async () => {
      const mockExec = jest.fn().mockResolvedValue(null);
      const mockFindByIdAndDelete = jest.fn().mockReturnValue({ exec: mockExec });
      mockUserModel.findByIdAndDelete = mockFindByIdAndDelete;

      await expect(service.remove('NON-EXISTENT')).rejects.toThrow(NotFoundException);
    });
  });
});