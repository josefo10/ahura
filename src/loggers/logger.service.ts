import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLoggerDto } from './dto/create-logger.dto';
import { UpdateLoggerDto } from './dto/update-logger.dto';
import { Logger, LoggerDocument } from './schemas/logger.schema';

@Injectable()
export class LoggerService {
  constructor(
    @InjectModel(Logger.name) private loggerModel: Model<LoggerDocument>,
  ) {}

  async create(createDto: CreateLoggerDto): Promise<Logger> {
    try {
      const created = new this.loggerModel(createDto);
      return await created.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error creating logger entry');
    }
  }

  async findAll(): Promise<Logger[]> {
    try {
      return await this.loggerModel.find().exec();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching logger entries');
    }
  }

  async findOne(id: string): Promise<Logger> {
    try {
      const entry = await this.loggerModel.findOne({ id }).exec();
      if (!entry) {
        throw new NotFoundException(`Logger entry with id ${id} not found`);
      }
      return entry;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching logger entry');
    }
  }

  async update(id: string, updateDto: UpdateLoggerDto): Promise<Logger> {
    try {
      const updated = await this.loggerModel
        .findOneAndUpdate({ id }, updateDto, { new: true })
        .exec();
      if (!updated) {
        throw new NotFoundException(`Logger entry with id ${id} not found`);
      }
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating logger entry');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.loggerModel.findOneAndDelete({ id }).exec();
      if (!result) {
        throw new NotFoundException(`Logger entry with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting logger entry');
    }
  }
}
