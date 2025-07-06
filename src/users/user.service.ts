// src/users/user.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const created = new this.userModel(createUserDto);
      return await created.save();
    } catch (error) {
      // Aquí maneja errores de validación o de BD
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error creando el usuario');
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await this.userModel.find().exec();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error obteniendo usuarios');
    }
  }

  async findOne(id: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ id }).exec();
      if (!user) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error buscando el usuario');
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    try {
      const updated = await this.userModel
        .findOneAndUpdate({ id }, dto, { new: true })
        .exec();
      if (!updated) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error actualizando el usuario');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.userModel.findOneAndDelete({ id }).exec();
      if (!result) {
        throw new NotFoundException(`Usuario con id ${id} no encontrado`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error eliminando el usuario');
    }
  }
}
