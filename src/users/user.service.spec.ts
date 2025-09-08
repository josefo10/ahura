
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

const mockUser = {
  _id: 'mockUserId',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashedPassword',
  role: 'user',
};

describe('UserService', () => {
  let service: UserService;
  let model: Model<UserDocument>;

  const mockUserModel = jest.fn().mockImplementation((dto) => ({
    ...dto,
    save: jest.fn().mockResolvedValue({
      ...mockUser,
      toJSON: jest.fn().mockReturnValue(mockUser),
    }),
  }));
  
  // Add static methods to the mock constructor function
  Object.assign(mockUserModel, {
    find: jest.fn(() => ({ exec: jest.fn() })),
    findById: jest.fn(),
    findOneAndUpdate: jest.fn(() => ({ exec: jest.fn() })),
    findByIdAndDelete: jest.fn(() => ({ exec: jest.fn() })),
    findOneAndDelete: jest.fn(() => ({ exec: jest.fn() })),
    findOne: jest.fn(() => ({ exec: jest.fn() })),
    create: jest.fn(),
    exec: jest.fn(),
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
    model = module.get<Model<UserDocument>>(getModelToken(User.name));
    
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createUserDto: CreateUserDto = { id: '1', name: 'test', email: 'test@test.com', password: 'test', role: 'user' };
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
      
      const result = await service.create(createUserDto);
      // El servicio devuelve el usuario sin la contraseña
      const { password, ...expectedResult } = mockUser;
      expect(result).toEqual(expectedResult);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      jest.spyOn(model, 'find').mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockUser]),
      } as any);
      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);
      const result = await service.findOne('some-id');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.findOne('some-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockUser),
      } as any);
      const result = await service.findByEmail('some-email');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findOne').mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);
      await expect(service.findByEmail('some-email')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = { name: 'updated' };
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) } as any);
      const result = await service.update('some-id', updateUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findOneAndUpdate').mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);
      await expect(service.update('some-id', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockReturnValue({ exec: jest.fn().mockResolvedValue(mockUser) } as any);
      const result = await service.remove('some-id');
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if user not found', async () => {
      jest.spyOn(model, 'findOneAndDelete').mockReturnValue({ exec: jest.fn().mockResolvedValue(null) } as any);
      await expect(service.remove('some-id')).rejects.toThrow(NotFoundException);
    });
  });
});
