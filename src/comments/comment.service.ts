import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './schemas/comment.schema';

@Injectable()
export class CommentService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
  ) {}

  async create(createDto: CreateCommentDto): Promise<Comment> {
    try {
      const created = new this.commentModel(createDto);
      return await created.save();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error creating comment');
    }
  }

  async findAll(): Promise<Comment[]> {
    try {
      return await this.commentModel.find().exec();
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching comments');
    }
  }

  async findOne(id: string): Promise<Comment> {
    try {
      const entry = await this.commentModel.findOne({ id }).exec();
      if (!entry) {
        throw new NotFoundException(`Comment with id ${id} not found`);
      }
      return entry;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error fetching comment');
    }
  }

  async update(id: string, updateDto: UpdateCommentDto): Promise<Comment> {
    try {
      const updated = await this.commentModel
        .findOneAndUpdate({ id }, updateDto, { new: true })
        .exec();
      if (!updated) {
        throw new NotFoundException(`Comment with id ${id} not found`);
      }
      return updated;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error updating comment');
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const result = await this.commentModel.findOneAndDelete({ id }).exec();
      if (!result) {
        throw new NotFoundException(`Comment with id ${id} not found`);
      }
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting comment');
    }
  }
}
